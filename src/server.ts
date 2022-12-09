import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { chatGpt } from "./chatgpt/chatgpt";
import { extractArticle } from "./extractArticle";
import { convertHtmlToText } from "./convertHtmlToText";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

// Create an endpoint that sends a POST with a prompt in the request body to the /chatgpt endpoint
// and returns the result of chatGpt.sendPrompt() in the response body.
app.post("/chatgpt", async (req: Request, res: Response) => {
  const prompt = req.body.prompt;
  const result = await chatGpt.sendPrompt(prompt);
  res.send(result);
});

app.get("/unfurl", async (req: Request, res: Response) => {
  const url = req.query.url;
  if (typeof url !== "string") {
    res.status(400).send("url must be a string");
    return;
  }
  let extractedArticle = await extractArticle(url);
  let text = await convertHtmlToText(extractedArticle?.content || "");
  let aiSummary = text ? await chatGpt.summarizeAndTag(text) : null;
  res.send({
    aiSummary,
    extractedArticle,
    text,
  });
});

app.get("/chatgpt", async (req: Request, res: Response) => {
  const prompt = req.query.prompt;
  if (typeof prompt !== "string") {
    res.status(400).send("prompt must be a string");
    return;
  }
  const result = await chatGpt.sendPrompt(prompt);
  res.send(result);
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
