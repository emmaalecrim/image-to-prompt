import express from 'express'
import fetch from 'node-fetch'
import bodyParser from 'body-parser'
import { inspectImg } from './replicate.ts'
import { addImage, getRankedImages, addGenerationBatch } from './weaviate.ts'
import { getImages } from './openai.ts'

const app = express()
app.use(bodyParser.json())

const port = 8001


app.post('/add-generation', async (req, res) => {
    try {
        const { url } = req.body
        // TODO: setup img upload to Storage bucket and return url
        // 1. Call inspector to decribe image once you have the url and upload to weaviate
        console.debug(`Inspecting image at ${url}`)
        const [description, image] = await Promise.all([inspectImg(url), fetchImg(url)].map(p => p.catch(e => e)))
        // 2. Add Goal Image to Weaviate(with generated prompt)
        const object = await addImage({ image, description })
        console.debug(`Added image to Weaviate with id ${object.id}`)
        return res.status(200).json({ id: object.id, prompt: description })
    } catch (e: any) {
        console.error(e.message)
        res.send(e.message)
    }
})

// TODO: Setup GCP bucket to store images
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
        console.log(JSON.stringify(generations, null, 2))
        const descriptions = await Promise.all(generations.map((url) => inspectImg(url).catch(e => e)))
        console.debug(`Descriptions: ${JSON.stringify(descriptions, null, 2)}`)
        const images = await Promise.all(generations.map((url) => fetchImg(url).catch(e => e)))
        await addGenerationBatch(images.map((url, i) => ({ image: url, description: descriptions[i], generation, baseImageId: id })))
        const rankedImages = await getRankedImages(id)
        console.log(JSON.stringify(rankedImages, null, 2))
        return res.status(200).json(rankedImages)
    } catch (e: any) {
        console.error(e.message)
        res.send(e.message)
    }
})


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

// TODO: move to utils
const fetchImg = async (url: string) => fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => Buffer.from(buf).toString('base64'))


