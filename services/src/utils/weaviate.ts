import weaviate, { WeaviateClient, generateUuid5 } from 'weaviate-ts-client';

// @ts-ignore - let me be happy
export const client: WeaviateClient = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

export async function addImage({ image, description }: { image: Blob, description: string }) {
    const res = await client.data.creator().withClassName("Image").withProperties({ image, description }).withId(generateUuid5(image.toString())).do();
    return res
}

export async function addGenerationBatch(dataObjs: {
    image: Blob, description: string, url: string
}[], { generation, baseImageId }: { generation?: number, baseImageId: string }) {
    // Create batch
    let batcher = client.batch.objectsBatcher();

    for (const dataObj of dataObjs) {
        const obj = client.data.creator()
            .withClassName("GeneratedImage")
            .withProperties({ image: dataObj.image, description: dataObj.description, generation, url: dataObj.url })
            .withId(generateUuid5(dataObj.image.toString()))
            .payload()
        const ref = client.data
            .referenceCreator()
            .withClassName('GeneratedImage')
            .withId(generateUuid5(dataObj.image.toString()))
            .withReferenceProperty('baseImage')
            .withReference(
                client.data
                    .referencePayloadBuilder()
                    .withClassName('Image')
                    .withId(baseImageId)
                    .payload()
            ).payload()
        batcher = batcher.withObjects(obj, ref)
    }
    // Flush
    return batcher.do();
}

export async function getRankedImages(id: string) {
    const originalVec = await client.data
        .getterById()
        .withClassName('Image')
        .withId(id)
        .withVector()
        .do();
    const res = await client.graphql
        .get()
        .withNearVector({
            // @ts-ignore - typings
            vector: originalVec?.vector,
        })
        .withClassName('GeneratedImage')
        .withFields('description generation url _additional  { certainty distance }')
        .do();

    return res
}

// UNCOMMENT BELOW:
// (async () => {
//     console.info("Creating classes")

//     await client.schema.classCreator().withClass({
//         "class": "Image",
//         "vectorizer": "multi2vec-clip",
//         "moduleConfig": {
//             "multi2vec-clip": {
//                 "textFields": ["description"],
//                 "imageFields": ["image"],
//             }
//         },
//         "properties": [
//             {
//                 "name": "image",
//                 "dataType": ["blob"],
//             },
//             {
//                 "name": "description",
//                 "dataType": ["text"],
//                 "description": "Text description of the image. Can be a prompt that generates this image or it's img2text description.",
//             },
//         ],
//     }).do().catch((e) => console.info("Image class already exists"));

//     await client.schema.classCreator().withClass({
//         "class": "GeneratedImage",
//         "vectorizer": "multi2vec-clip",
//         "moduleConfig": {
//             "multi2vec-clip": {
//                 "textFields": ["description"],
//                 "imageFields": ["image"],
//             },
//             "ref2vec-centroid": {
//                 "referenceProperties": ["hasParagraphs"],
//                 "method": "mean"
//             }
//         },
//         "properties": [
//             {
//                 "name": "image",
//                 "dataType": ["blob"],
//             },
//             {
//                 "name": "description",
//                 "dataType": ["text"],
//                 "description": "Text description of the image. Can be a prompt that generates this image or it's img2text description.",
//             },
//             {
//                 "name": "generation",
//                 "dataType": ["number"],
//                 "description": "How many generations this image is from the original image.",
//             },
//             {
//                 "name": "baseImage",
//                 "dataType": ["Image"],
//                 "description": "The original image and prompt that were used to generate this image.",

//             },
//             {
//                 "name": "url",
//                 "dataType": ["string"],
//                 "description": "The url of the image.",

//             }
//         ],
//     }).do().catch((e) => console.info("GeneratedImage class already exists"));
//     console.info("Successfully created classes!")
// })();




