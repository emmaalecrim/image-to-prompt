import Replicate from "replicate";
import 'dotenv/config'


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export const inspectImg = (img: Blob) => replicate.run(
    "methexis-inc/img2prompt:50adaf2d3ad20a6f911a8a9e3ccf777b263b8596fbd2c8fc26e8888f8a0edbb5",
    {
        input: {
            image: img,
        }
    }
);