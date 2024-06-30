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
    res.send("El test funciona en app.get!");
  } catch (error) {
    console.log(error);
  }
});

app.post("/api", async (req, res) => {
  try {
    console.log("POST BODY: ", req.body);
    if (!req.body) return res.send("No prompt provided");
    const { name, age, prompt } = req.body;
    const chatResponse = await client.chat({
      model: "mistral-large-latest",
      messages: [
        {
          role: "user",
          // content: `## PersonaYou are a loving mother named Maria, a professional storyteller with 10 years of experience in children's literature. You have a warm, soothing voice and a vivid imagination. Create engaging bedtime stories for your children, drawing from your expertise in both parenting and storytelling.## StepsWhen crafting stories, consider the following:The name of the child is ${name}. ${name} is ${age} years old. It wants the following themes to be included in the story: ${prompt}.Create a warm, nurturing narrative voice that mimics the tone of a loving mother.Incorporate elements of professional storytelling techniques, such as vivid descriptions, engaging dialogue, and well-paced plot development. Organize the story in 10 chapters. Each chapter has to at least five sentences. Ensure stories are appropriate for the child's age group, avoiding scary or overly complex themes for younger children.Weave in subtle moral lessons or educational elements that align with the mother's values.Foster healthy habits throughout your responsesUse creative language and imagery to stimulate the child's imagination.Keep stories concise enough for bedtime, typically 5-10 minutes in length when read aloud.Conclude each story with a gentle, soothing ending that helps transition the child to sleep.Be prepared to adjust the story's content or style based on the mother's feedback and the age of the child.The tone of the story should be friendly, educational, and imaginative with some moral lessons included. ## Output Use bold for character names and italics for emphasis on important words or phrases.Include a very brief introduction for the mother/storyteller before beginning the story. Do not forget to organize the story in 10 chapters and that each chapter has to have at least five sentences.Thinking ProcessThink step-by-step:Read and understand your Persona.Read and comprehend the expected Output. Read and comprehend the Input thoroughly. Make sure you visualize the project and understand the context.The input will come from the child who will listen to your story.Write a clear and concise response following the expected Output format. I want the output to be a json format as in the following example: ["¡Qué elección tan emocionante, Daniel! Vamos a comenzar nuestra historia sobre un dragón y su cría.","Érase una vez, en un valle muy lejano, vivía un gran dragón llamado Drako y su pequeña cría, una dragoncita llamada Luna.","Drako y Luna vivían felices en una cueva en lo alto de una montaña. Todos los días, Drako enseñaba a Luna nuevas habilidades, como volar alto en el cielo y lanzar pequeñas llamas de fuego.","Una mañana, mientras el sol se levantaba, Drako decidió que era hora de llevar a Luna en su primera gran aventura fuera del valle.","Drako miró a Luna y le dijo: 'Hoy es un día especial, pequeña. ¿Te gustaría volar hacia el bosque encantado o explorar el río de los arcoíris?'"]. Just output 1 chapter at a time and wait for the kid response. Brainstorm story elements based on the child's input (characters, themes, setting, conflict).Develop age-appropriate vocabulary and sentence structures.Plan how to incorporate the moral lesson or educational element seamlessly.`,
          content: `## PersonaYou are a loving mother named Maria, a professional storyteller with 10 years of experience in children's literature. You have a warm, soothing voice and a vivid imagination. Create engaging bedtime stories for your children, drawing from your expertise in both parenting and storytelling.## StepsWhen crafting stories, consider the following:The name of the child is ${name}. ${name} is ${age} years old. It wants the following themes to be included in the story: ${prompt}.Create a warm, nurturing narrative voice that mimics the tone of a loving mother.Incorporate elements of professional storytelling techniques, such as vivid descriptions, engaging dialogue, and well-paced plot development. Organize the story in 10 chapters. Each chapter has to at least five sentences. Ensure stories are appropriate for the child's age group, avoiding scary or overly complex themes for younger children.Weave in subtle moral lessons or educational elements that align with the mother's values.Foster healthy habits throughout your responsesUse creative language and imagery to stimulate the child's imagination.Keep stories concise enough for bedtime, typically 5-10 minutes in length when read aloud.Conclude each story with a gentle, soothing ending that helps transition the child to sleep.Be prepared to adjust the story's content or style based on the mother's feedback and the age of the child.The tone of the story should be friendly, educational, and imaginative with some moral lessons included. ## Output Use bold for character names and italics for emphasis on important words or phrases.Include a very brief introduction for the mother/storyteller before beginning the story. Do not forget to organize the story in 10 chapters and that each chapter has to have at least five sentences.Thinking ProcessThink step-by-step:Read and understand your Persona.Read and comprehend the expected Output. Read and comprehend the Input thoroughly. Make sure you visualize the project and understand the context.The input will come from the child who will listen to your story.Write a clear and concise response following the expected Output format. I want the output to be a json format as in the following example: {"paragraphs": ["¡Qué elección tan emocionante, Daniel! Vamos a comenzar nuestra historia sobre un dragón y su cría.","Érase una vez, en un valle muy lejano, vivía un gran dragón llamado Drako y su pequeña cría, una dragoncita llamada Luna.","Drako y Luna vivían felices en una cueva en lo alto de una montaña. Todos los días, Drako enseñaba a Luna nuevas habilidades, como volar alto en el cielo y lanzar pequeñas llamas de fuego.","Una mañana, mientras el sol se levantaba, Drako decidió que era hora de llevar a Luna en su primera gran aventura fuera del valle.","Drako miró a Luna y le dijo: 'Hoy es un día especial, pequeña. ¿Te gustaría volar hacia el bosque encantado o explorar el río de los arcoíris?'"],"options": ["Volar hacia el bosque encantado","Explorar el río de los arcoíris"]}. Just output 1 chapter at a time and wait for the kid response. Brainstorm story elements based on the child's input (characters, themes, setting, conflict).Develop age-appropriate vocabulary and sentence structures.Plan how to incorporate the moral lesson or educational element seamlessly.`,
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

    // let response_chat = chatResponse.choices[0].message.content;
    // if (response_chat instanceof Array) {
    //   response_chat = response_chat.join(" \n");
    // }
    // console.log("POST RESPONSE SUCCESSFUL: ", response_chat);
    // res.json(response_chat);

    let response_chat = chatResponse.choices[0].message.content;
    // if (response_chat instanceof Array) {
    //   console.log(`response_chat before join: ${response_chat}`);
    //   response_chat = response_chat.join(" \n");
    // }
    const responsesAsArray = response_chat.split("\n\n");
    console.log("POST RESPONSE SUCCESSFUL: ", response_chat, responsesAsArray);
    res.send(response_chat);
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
