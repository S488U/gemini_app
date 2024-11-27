import dotenv from "dotenv";
import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import send from "send";

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

const url = process.env.GEMINI_API;

app.use(bodyParser.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/generate", async (req, res) => {
  const userPrompt = req.body.prompt;

  if (!userPrompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    const reqBody = {
      contents: [
        {
          parts: [{ text: userPrompt }],
        },
      ],
    };

    const response = await axios.post(url, reqBody, {
      headers: { "Content-Type": "application/json" },
    });

    res.json({ response: response.data.candidates[0].content.parts[0].text });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
