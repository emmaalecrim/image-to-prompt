import OpenAI from "openai";



const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const imageOpt: {
    n: number;
    size: string;
} = {
    n: 5,
    size: "256x256",
}

// @ts-expect-error - where are my types???
const getImages = (prompt: string, options = imageOpt): Promise<string[]> => openai.images.generate({ prompt, ...options }).then(res => res?.data?.map((el) => el?.url) || "")


export { getImages };