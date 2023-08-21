import weaviate, { WeaviateClient } from 'weaviate-ts-client';

// @ts-ignore - let me be happy
export const client: WeaviateClient = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

(async () => {
    console.info("Creating classes")

    await client.schema.classCreator().withClass({
        "class": "Image",
        "vectorizer": "multi2vec-clip",
        "moduleConfig": {
            "multi2vec-clip": {
                "textFields": ["description"],
                "imageFields": ["image"],
            }
        },
        "properties": [
            {
                "name": "image",
                "dataType": ["blob"],
            },
            {
                "name": "description",
                "dataType": ["text"],
                "description": "Text description of the image. Can be a prompt that generates this image or it's img2text description.",
            },
        ],
    }).do().catch((e) => console.info("Image class already exists"));

    await client.schema.classCreator().withClass({
        "class": "GeneratedImage",
        "vectorizer": "multi2vec-clip",
        "moduleConfig": {
            "multi2vec-clip": {
                "textFields": ["description"],
                "imageFields": ["image"],
            },
            "ref2vec-centroid": {
                "referenceProperties": ["hasParagraphs"],
                "method": "mean"
            }
        },
        "properties": [
            {
                "name": "image",
                "dataType": ["blob"],
            },
            {
                "name": "description",
                "dataType": ["text"],
                "description": "Text description of the image. Can be a prompt that generates this image or it's img2text description.",
            },
            {
                "name": "generation",
                "dataType": ["number"],
                "description": "How many generations this image is from the original image.",
            },
            {
                "name": "baseImage",
                "dataType": ["Image"],
                "description": "The original image and prompt that were used to generate this image.",

            },
            {
                "name": "url",
                "dataType": ["string"],
                "description": "The url of the image.",

            }
        ],
    }).do().catch((e) => console.info("GeneratedImage class already exists"));
    console.info("Successfully created classes!")
})();