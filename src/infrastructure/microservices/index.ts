import express from 'express'
import fetch from 'node-fetch'
import { inspectImg } from './replicate.ts'

const app = express()



const port = 8080
const imageUrl = 'https://thispersondoesnotexist.com'

app.post('/', async (req, res) => {
    try {
        // TODO: setup img upload to bucket, get url. Keep img aroud for process.

        // 1. Call inspector microservice - provides a prompt for the image
        const prompt = await inspectImg(imageUrl);


        return res.send(prompt)
    } catch (e: any) {
        console.error(e.message)
        res.send(e.message)
    }

})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})

const fetchImg = async (url: string) => fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => Buffer.from(buf).toString('base64'))