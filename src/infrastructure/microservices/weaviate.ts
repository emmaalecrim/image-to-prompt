import weaviate, { WeaviateClient, ApiKey, generateUuid5 } from 'weaviate-ts-client';


const client: WeaviateClient = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
    // apiKey: new ApiKey(process.env.WEAVIATE_API_KEY || ""),  // Replace w/ your Weaviate instance API key
    // headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || "" },  // Replace with your inference API key
});

// (async () => {
// const res = await client.schema.classCreator().withClass({
//     "class": "Image",
//     "vectorizer": "multi2vec-clip",
//     "moduleConfig": {
//         "multi2vec-clip": {
//             "textFields": ["description"],
//             "imageFields": ["image"],
//         }
//     },
//     "properties": [
//         {
//             "name": "image",
//             "dataType": ["blob"],
//         },
//         {
//             "name": "description",
//             "dataType": ["text"],
//             "description": "Text description of the image. Can be a prompt that generates this image or it's img2text description.",
//         }
//     ],
// }).do();
// await client.schema.classCreator().withClass({
//     "class": "GeneratedImage",
//     "vectorizer": "multi2vec-clip",
//     "moduleConfig": {
//         "multi2vec-clip": {
//             "textFields": ["description"],
//             "imageFields": ["image"],
//         }
//     },
//     "properties": [
//         {
//             "name": "image",
//             "dataType": ["blob"],
//         },
//         {
//             "name": "description",
//             "dataType": ["text"],
//             "description": "Text description of the image. Can be a prompt that generates this image or it's img2text description.",
//         },
//         {
//             "name": "generation",
//             "dataType": ["number"],
//             "description": "How many generations this image is from the original image.",
//         },
//         {
//             "name": "baseImage",
//             "dataType": ["Image"],
//             "description": "The original image and prompt that were used to generate this image.",
//         }
//     ],
// }).do();


// })();





export async function addImage({ image, description }: { image: Blob, description: string }) {
    const res = await client.data.creator().withClassName("Image").withProperties({ image, description }).do();
    return res
}

export async function addGenerationBatch(dataObjs: {
    image: Blob, description: string, generation?: number, baseImageId: string
}[]) {
    // Create batch
    let batcher = client.batch.objectsBatcher();
    let referenceBatcher = client.batch.referencePayloadBuilder();
    for (const dataObj of dataObjs)
        batcher = batcher.withObject({
            class: "ImageGeneration",
            properties: dataObj,
            id: generateUuid5(dataObj.image.toString()),
        })
    // Flush
    const batchRes = await batcher.do();
    console.log(JSON.stringify(batchRes, null, 2))
    // Create references
    for (const dataObj of dataObjs) {
        referenceBatcher
            .withFromClassName("ImageGeneration")
            .withFromId(generateUuid5(dataObj.image.toString()))
            .withToClassName("Image")
            .withToId(dataObj.baseImageId)
            .do();
    }
    // Flush
    const referenceRes = await referenceBatcher.do();
    console.log(JSON.stringify(referenceRes, null, 2))
}

export async function getRankedImages(id: string) {
    const res = await client.graphql
        .get()
        .withClassName('ImageGeneration')
        .withNearObject({ id })
        .withFields('description _additional { distance generation id }')
        .do();

    return res
}





