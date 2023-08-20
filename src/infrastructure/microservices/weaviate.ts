import weaviate, { WeaviateClient, ApiKey, generateUuid5 } from 'weaviate-ts-client';


const client: WeaviateClient = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
    // apiKey: new ApiKey(process.env.WEAVIATE_API_KEY || ""),  // Replace w/ your Weaviate instance API key
    // headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || "" },  // Replace with your inference API key
});

(async () => {
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
    //         },
    //         "ref2vec-centroid": {
    //             "referenceProperties": ["hasParagraphs"],
    //             "method": "mean"
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
})();





export async function addImage({ image, description }: { image: Blob, description: string }) {
    const res = await client.data.creator().withClassName("Image").withProperties({ image, description }).withId(generateUuid5(image.toString())).do();
    return res
}

export async function addGenerationBatch(dataObjs: {
    image: Blob, description: string
}[], { generation, baseImageId }: { generation?: number, baseImageId: string }) {
    // Create batch
    let batcher = client.batch.objectsBatcher();

    for (const dataObj of dataObjs) {
        const obj = client.data.creator()
            .withClassName("GeneratedImage")
            .withProperties({ image: dataObj.image, description: dataObj.description, generation })
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
            // @ts-ignore - afaf
            vector: originalVec?.vector,
        })
        .withClassName('GeneratedImage')
        .withFields('description generation _additional { certainty distance }')
        .do();

    return res
}





