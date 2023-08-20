import fetch from 'node-fetch'

const { FREEIMAGE_API_KEY } = process.env

export const fetchImg = async (url: string) => fetch(url)
    .then(res => res.arrayBuffer())
    .then(buf => Buffer.from(buf).toString('base64'))

export const uploadImg = async (image: string) => {
    const res = await fetch('https://freeimage.host/api/1/upload', {
        method: 'POST',
        body: JSON.stringify({
            key: FREEIMAGE_API_KEY,
            action: 'upload',
            source: image,
        })
    })
    const data = await res.json()
    // @ts-expect-error - typings
    return data?.image?.url
}