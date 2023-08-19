import Replicate from 'replicate'

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || ''
})

/**
 * Inspect an image and return a prompt. Uses Replicate's API.
 * @param {string} image
 * @returns {string} prompt - approximate text that descibes the image through generative models
 */
export const inspectImg = async (image: string) => await replicate.run(
  'methexis-inc/img2prompt:50adaf2d3ad20a6f911a8a9e3ccf777b263b8596fbd2c8fc26e8888f8a0edbb5',
  {
    input: {
      image
    }
  }
)
