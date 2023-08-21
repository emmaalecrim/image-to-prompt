import express from 'express'
import bodyParser from 'body-parser'
import multer from 'multer'
import cors from 'cors'
import { inspectImg } from './utils/replicate.ts'
import { addImage, getRankedImages, addGenerationBatch } from './utils/weaviate.ts'
import { getImages } from './utils/openai.ts'
import { fetchImg, uploadFromMemory } from './utils/helpers.ts'


const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


const app = express()
app.use(cors({ origin: true }), bodyParser.json())

const port = 8001


app.post('/add-generation', upload.single('file'), async (req, res) => {
    try {
        const file = req.file

        if (!file) {
            throw new Error("No file uploaded")
        }
        // TODO: setup img upload to Storage bucket and return url
        const url = await uploadFromMemory(file.buffer, file.originalname)
        console.debug(`Inspecting image at ${url}`)
        // 1. Call inspector to decribe image once you have the url and upload to weaviate
        const [description, image] = await Promise.all([inspectImg(url), fetchImg(url)].map(p => p.catch(e => e)))
        // 2. Add Goal Image to Weaviate(with generated prompt)
        const object = await addImage({ image, description })
        console.debug(`Added image to Weaviate with id ${object.id}`)
        return res.status(200).json({ id: object.id, prompt: description, url })
        // eslint - disable - next - line @typescript-eslint / no - explicit - any
    } catch (e: any) {
        console.error(e.message)
        return res.json({ error: e.message })
    }
})

// TODO: Setup cloudbuild to deploy to GCP
// TODO: Setup GCP cloud run to run microservices
// TODO: Setup multi-tenancy

// 3. Get generations from DALL-E using the prompt
// 4. Describe images returned by DALL-E
// 5. Upload generated images to weaviate
// 6. Get distance values
// 7. Return { prompt, id, distance } to client
// use agi to improve prompts based on user/system feedback

app.post('/iterate-generation', async (req, res) => {
    const { prompt, id, generation } = req.body
    try {
        const generations = await getImages(prompt)
        console.debug("--- images: ", JSON.stringify(generations, null, 2))
        const descriptions = await Promise.all(generations.map((url) => inspectImg(url).catch(e => e)))
        console.debug(`--- Descriptions: ${JSON.stringify(descriptions, null, 2)}`)
        const images = await Promise.all(generations.map((url) => fetchImg(url).catch(e => e)))
        await addGenerationBatch(images.map((image, i) => ({ image, description: descriptions[i], url: generation[i] })), { generation, baseImageId: id })
        const rankedImages = await getRankedImages(id)
        console.debug("--- Rankings", JSON.stringify(rankedImages?.data?.Get?.GeneratedImage, null, 2))
        return res.status(200).json(rankedImages?.data?.Get?.GeneratedImage)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
        console.error(e.message)
        res.send(e.message)
    }
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

