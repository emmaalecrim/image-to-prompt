import express from 'express'
import fetch from 'node-fetch'
import bodyParser from 'body-parser'
import { inspectImg } from './replicate'
import { addImage } from './weaviate'

const app = express()
app.use(bodyParser.json())

const port = 8001

app.post('/add-generation', async (req, res) => {
  try {
    const { url } = req.body
    // TODO: setup img upload to bucket, get url. Keep img aroud for process.
    // 1. Call inspector microservice to decribe image
    console.debug(`Inspecting image at ${url}`)
    const [prompt, image] = await Promise.all(
      [inspectImg(url), fetchImg(url)].map(async (p) => await p.catch((e) => e))
    )
    // 2. Add Goal Image to Weaviate(with generated prompt)
    addImage(image, prompt).then((res) => {
      console.debug('Added image to Weaviate', res)
    })
    // 3. Get generations from DALL-E using the prompt
    // 4. Describe images returned by DALL-E
    // 5. Upload generated images to weaviate
    // 6. Return prompt and distance values
    // use agi to improve prompts based on user/system feedback
    // TODO: Setup GCP bucket to store images
    // TODO: Setup cloudbuild to deploy to GCP
    // TODO: Setup GCP cloud run to run microservices
    // TODO: Setup multi-tenancy
    return res.send(prompt)
  } catch (e: any) {
    console.error(e.message)
    res.send(e.message)
  }
})

app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})

// TODO: move to utils
const fetchImg = async (url: string) => await fetch(url)
  .then(async (res) => await res.arrayBuffer())
  .then((buf) => Buffer.from(buf).toString('base64'))
