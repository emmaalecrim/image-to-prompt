import weaviate, { WeaviateClient, ApiKey } from 'weaviate-ts-client';


const client: WeaviateClient = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
    // apiKey: new ApiKey(process.env.WEAVIATE_API_KEY || ""),  // Replace w/ your Weaviate instance API key
    // headers: { 'X-OpenAI-Api-Key': process.env.OPENAI_API_KEY || "" },  // Replace with your inference API key
});

// (async () => {
//     const res = await client.schema.classCreator().withClass({
//         "class": "Image",
//         "vectorizer": "img2vec-neural",
//         "vectorIndexConfig": {
//             "distance": "cosine",
//         },
//         "moduleConfig": {
//             "img2vec-neural": {
//                 "imageFields": [
//                     "image"
//                 ]
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
//     }).do();
//     console.debug(res);
// })();


export async function addImage(image: string, description: string) {
    const res = await client.data.creator().withClassName("Image").withProperties({ image, description }).do();
    console.debug(res);
}




