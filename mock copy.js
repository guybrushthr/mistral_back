API_KEY = "FcZSsytB4tCVcdnP5A6d4zeot4Na2wfL";

ENDPOINT = "https://api.mistral.ai/v1/chat/completions";

MOCK_PAYLOAD = {
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
