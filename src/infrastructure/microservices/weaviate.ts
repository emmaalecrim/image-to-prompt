import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';


const client: WeaviateClient = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
    apiKey: new ApiKey(process.env.WEAVIATE_API_KEY || ""),  // Replace w/ your Weaviate instance API key
    headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || "" },  // Replace with your inference API key
});

const classObj = {
    "class": "Image",
    "vectorizer": "img2vec-neural",
    "vectorIndexConfig": {
        "distance": "cosine",
    },
    "moduleConfig": {
        "img2vec-neural": {
            "imageFields": [
                "image"
            ]
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
}



async function addSchema() {
    const res = await client.schema.classCreator().withClass(classObj).do();
    console.debug(res);
}



