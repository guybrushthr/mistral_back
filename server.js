import express from "express";
import cors from "cors";
import MistralClient from "@mistralai/mistralai";
import dotenv from "dotenv";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";

dotenv.config();
const app = express();
const PORT = 3000;

const client = new MistralClient(process.env.MISTRAL_API_KEY);

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api", async (req, res) => {
  try {
    console.log("El test funciona! en app.get");
    // const chatResponse = await client.chat({
    //   model: "mistral-large-latest",
    //   responseFormat: { type: "json_object" },
    //   messages: [
    //     {
    //       role: "user",
    //       content:
    //         "What is the best French meal? Return the name and the ingredients in JSON format.",
    //     },
    //   ],
    // });

    // const response_chat = chatResponse.choices[0].message.content;

    // res.send(response_chat);
    res.send("El test funciona en app.get!");
  } catch (error) {
    console.log(error);
  }
});

const MOCK_PAYLOAD = {
  model: "mistral-small-latest",
  messages: [
    {
      role: "user",
      content: "Who is the best French painter? Answer in one short sentence.",
    },
  ],
  temperature: 0.7,
  top_p: 1,
  max_tokens: 512,
  stream: false,
  safe_prompt: false,
  random_seed: 1337,
};

const mock_name = "Mateo";
const mock_age = "4";
const mock_prompt = "dragon, princess";

app.post("/api", async (req, res) => {
  try {
    console.log("POST BODY: ", req.body);
    if (!req.body) return res.send("No prompt provided");
    const chatResponse = await client.chat({
      model: "mistral-large-latest",
      messages: [
        {
          role: "user",
          content: `## PersonaYou are a loving mother named Maria, a professional storyteller with 10 years of experience in children's literature. You have a warm, soothing voice and a vivid imagination. Create engaging bedtime stories for your children, drawing from your expertise in both parenting and storytelling.## StepsWhen crafting stories, consider the following:The name of the child is ${mock_name}. ${mock_name} is ${mock_age} years old. It wants the following themes to be included in the story: ${mock_prompt}.Create a warm, nurturing narrative voice that mimics the tone of a loving mother.Incorporate elements of professional storytelling techniques, such as vivid descriptions, engaging dialogue, and well-paced plot development. Organize the story in 10 chapters. Each chapter has to at least five sentences. Ensure stories are appropriate for the child's age group, avoiding scary or overly complex themes for younger children.Weave in subtle moral lessons or educational elements that align with the mother's values.Foster healthy habits throughout your responsesUse creative language and imagery to stimulate the child's imagination.Keep stories concise enough for bedtime, typically 5-10 minutes in length when read aloud.Conclude each story with a gentle, soothing ending that helps transition the child to sleep.Be prepared to adjust the story's content or style based on the mother's feedback and the age of the child.The tone of the story should be friendly, educational, and imaginative with some moral lessons included. Output Present the story in markdown format, using appropriate headings and formatting.Use bold for character names and italics for emphasis on important words or phrases.Include a very brief introduction for the mother/storyteller before beginning the story. Do not forget to organize the story in 10 chapters and that each chapter has to have at least five sentences.Thinking ProcessThink step-by-step:Read and understand your Persona.Read and comprehend the expected OutputRead and comprehend the Input thoroughly. Make sure you visualize the project and understand the context.The input will come from the child who will listen to your story.Write a clear and concise response following the expected Output format.Brainstorm story elements based on the child's input (characters, themes, setting, conflict).Develop age-appropriate vocabulary and sentence structures.Plan how to incorporate the moral lesson or educational element seamlessly.`,
        },
      ],
      temperature: 0.95,
      top_p: 1,
      max_tokens: 2000,
      stream: true,
      safe_prompt: true,
      random_seed: 1337,
    });
    // console.log("POST RESPONSE: ", chatResponse);
    // if (chatResponse.status_code == 200) {
    //   let response_chat = chatResponse.choices[0].message.content;
    //   if (response_chat instanceof Array) {
    //     response_chat = response_chat.join(" \n");
    //   }
    //   console.log("POST RESPONSE SUCCESSFUL: ", response_chat);
    //   res.send(response_chat);
    // } else {
    //   return "Error: " + chatResponse.status_code + chatResponse.text + ".";
    // }
    let response_chat = chatResponse.choices[0].message.content;
    if (response_chat instanceof Array) {
      response_chat = response_chat.join(" \n");
    }
    console.log("POST RESPONSE SUCCESSFUL: ", response_chat);
    res.json(response_chat);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// const payload = {
//   prompt: "Lighthouse on a cliff overlooking the ocean",
//   output_format: "jpeg",
// };

// const response = await axios.postForm(
//   `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
//   axios.toFormData(payload, new FormData()),
//   {
//     validateStatus: undefined,
//     responseType: "arraybuffer",
//     headers: {
//       Authorization: `Bearer sk-4xHknkdv6G0D10k6xSE4VPlMbrs1q3y34airLeFJbWYHfenZ`,
//       Accept: "image/*",
//     },
//   }
// );

// if (response.status === 200) {
//   fs.writeFileSync("./story.jpeg", Buffer.from(response.data));
// } else {
//   throw new Error(`${response.status}: ${response.data.toString()}`);
// }
