# iGP Backend Services

Welcome to the documentation for the iGP (Image Generation Prompting) Backend Services project! This project manages backend services for the iGP platform, which generates images based on prompts. Authored by Emma Alecrim under the MIT License.

## Description

The iGP Backend Services project provides backend infrastructure for the iGP platform, offering unique image generation capabilities through prompts.

## Setup

1. Install Node.js and npm.
2. Choose the path that contains the backend: `cd services`.
3. Install Yarn globally: `npm install -g yarn`.
4. Install Docker and ensure the Docker daemon is running.
5. add the following variables to your .env file:
6. Run `auth` to authenticate with gcloud. Must have gcloud CLI installed. Uses applicationDefault Auth.
7. Uncomment the self invokin fn in utils/weaviate.ts the first run to create the classes in weaviate.

```.env
# your Replicate API key  https://replicate.com/account/api-tokens
REPLICATE_API_KEY=""
# Your OpenAI key
OPENAI_API_KEY=""
# Your GCP Bucket name defaults to image-to-prompt
# https://cloud.google.com/storage/docs/creating-buckets
# Also make sure your bucket is setup for public access by enabling "allUsers" as "Storage Legacy Object Reader"(You can add this in bucket's permissions tab)
BUCKET_NAME=""
```

## How It Works

The iGP Backend Services have two endpoints:

### `/add-generation`

Receives an image via a multipart form:

1. Uploads the image to a Google Cloud Storage (GCS) Bucket.
2. Describes the image and generates a prompt using `inspectImg` and `fetchImg`.
3. Adds image and prompt to Weaviate using `addImage`.

**Request Input:**

- **Method:** POST
- **Route:** `/add-generation`
- **Body:** `image` (Multipart form data - file upload)

**Response Output:**

- **Status:** 200 OK
- **Body:**

  ```json
  {
    "id": "uuid5Id",
    "prompt": "generated-prompt",
    "url": "image-url"
  }
  ```

### `/iterate-generation`

Handles image generation iteration:

1. Expects JSON body with `prompt`, `id`, and `generation`.
2. Calls `getImages` to obtain generated image URLs.
3. Generates text descriptions for images using `inspectImage`.
4. Saves everything to Weaviate
5. Queries the generated images by vector distance from the original image

**Request Input:**

- **Method:** POST
- **Route:** `/iterate-generation`
- **Body:**

  ```typescript
  {
    prompt: string,
    id: string,
    generation: number
  }
  ```

**Response Output:**

- **Status:** 200 OK
- **Body:**

  ```json
  [
    {
      "_additional": {
        "certainty": 0.9510990977287292,
        "distance": 0.097801805
      },
      "description": "\n\na green field with clouds in the sky, a matte painting by Puru, shutterstock, color field, windows xp, windows vista, velvia",
      "generation": 0
    }
  ]
  ```

## Available Scripts

Run scripts using `yarn <script-name>`:

- `docker:up`: Start Docker containers.
- `docker:down`: Stop Docker containers.
- `start`: Start the application with nodemon.
- `create-classes`: Execute `createClasses.ts`.
- `demo`: Setup demo environment (Docker, class generation, nodemon).
- `lint`: Use `eslint` to fix code issues.

## Dependencies

Key dependencies include:

- `@google-cloud/storage`: Google Cloud Storage integration.
- `body-parser`: Middleware for parsing requests in Express.
- `express`: Web application framework for Node.js.
- `graphql`: GraphQL implementation for Node.js.
- `multer`: Middleware for handling file uploads.
- `node-fetch`: Library for making HTTP requests.
- `openai`: OpenAI API client.
- `replicate`: Package for replicating data.
- `weaviate-ts-client`: Client library for Weaviate.

## Contributing

Interested in contributing? Fork the repository, make changes, and submit a pull request adhering to coding standards.

## Conclusion

Thank you for your interest in the iGP Backend Services project! Reach out to maintainers for questions.

Happy coding! 🚀
