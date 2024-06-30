import express from "express";
import cors from "cors";
import MistralClient from "@mistralai/mistralai";

const app = express();
const PORT = 3000;

const client = new MistralClient("FcZSsytB4tCVcdnP5A6d4zeot4Na2wfL");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/api", async (req, res) => {
  try {
    console.log("El test funciona!");
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
    res.send("El test funciona!");
  } catch (error) {
    console.log(error);
  }
});

app.post("/api", async (req, res) => {
  try {
    console.log("POST BODY: ", req.body);
    if (!req.body) return res.send("No prompt provided");
    const chatResponse = await client.chat({
      model: "mistral-large-latest",
      responseFormat: { type: "json_object" },
      messages: [
        {
          role: "user",
          content: req.body.prompt,
        },
      ],
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
