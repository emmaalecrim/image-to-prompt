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
        .withFields('description generation _additional url { certainty distance }')
        .do();

    return res
}





