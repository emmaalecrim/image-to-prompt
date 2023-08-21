import fetch from 'node-fetch'
import { Storage } from '@google-cloud/storage';


// Creates a client
const storage = new Storage();

export const fetchImg = async (url: string) => fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => Buffer.from(buf).toString('base64'))

// The ID of your GCS bucket
const bucketName = process.env.BUCKET_NAME || 'image-to-prompt';


export async function uploadFromMemory(contents: string | Buffer, destFileName: string) {
    const filename = encodeURI(destFileName)
    await storage.bucket(bucketName).file(destFileName).save(contents);
    return `https://storage.googleapis.com/${bucketName}/${filename}`
}
