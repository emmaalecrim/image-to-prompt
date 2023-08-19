import weaviate, { WeaviateClient, ObjectsBatcher, ApiKey } from 'weaviate-ts-client';
import fetch from 'node-fetch';

const client: WeaviateClient = weaviate.client({
    scheme: 'https',
    host: 'image-to-text-ejn1stst.weaviate.network',  // Replace with your endpoint
    apiKey: new ApiKey('6xUuqg53fAVcYKpkzaUHI6oCfEEblCIXqNsc'),  // Replace w/ your Weaviate instance API key
    headers: { 'X-OpenAI-Api-Key': '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' },  // Replace with your inference API key
});

const classObj = {
    'class': 'Question',
    'vectorizer': 'img2vec-openai',  // If set to "none" you must always provide vectors yourself. Could be any other "text2vec-*" also.
    'moduleConfig': {
        'text2vec-openai': {},
        'generative-openai': {}  // Ensure the `generative-openai` module is used for generative queries
    },
};

async function addSchema() {
    const res = await client.schema.classCreator().withClass(classObj).do();
    console.log(res);
}

await addSchema()