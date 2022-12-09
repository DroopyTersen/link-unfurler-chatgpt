import { ChatGPTAPI } from "chatgpt";
import markdownToHtml from "src/markdownToHtml";
let _chatGptApi: ChatGPTAPI = null;
const createChatGptApi = async () => {
  // Lazily import ChatGPTAPI from chatgpt
  const { ChatGPTAPI } = await import("chatgpt");
  const chatGptApi = new ChatGPTAPI({
    sessionToken: process.env.CHATGPT_SESSION_TOKEN,
    accessTokenTTL: 24 * 60 * 60 * 1000,
    markdown: false,
  });
  return chatGptApi;
};

const getChatGptApi = async () => {
  if (_chatGptApi === null) {
    _chatGptApi = await createChatGptApi();
  }
  return _chatGptApi;
};

export const chatGpt = {
  sendPrompt: async (prompt: string) => {
    let api = await getChatGptApi();
    await api.ensureAuth();
    let responseInMarkdown = await api.sendMessage(prompt);
    return markdownToHtml(responseInMarkdown);
  },
  summarizeAndTag: async (content: string) => {
    let prompt = `Please summarize, classify with tags, provide sentiment analysis, find any people mentioned, look for any stock ticker symbols (where a stock Ticker symbol is 1 to 5 uppercased characters), and companies that are referenced in the following content. Please respond in the format of:

Summary: <A summary that is a few sentences long>
Tags: <tag1>, <tag2>, <tag3>
StockTickers: <ticker1>, <ticker2>, <ticker3>
Companies: <company1>, <company2>, <company3>
Sentiment: <sentiment>
People: <person1>, <person2>, <person3>
    
${content}`;

    console.log("PROMPT-------");
    console.log(prompt);
    console.log("PROMPT-------");
    let api = await getChatGptApi();
    let response = await api.sendMessage(prompt);
    console.log("RESPONSE-------");
    console.log(response);
    console.log("RESPONSE-------");

    try {
      // Use a regex to pull out the summmary, tags, and sentiment from the response
      let summary = response.match(/Summary: (.*)/)?.[1];
      let tags = response
        .match(/Tags: (.*)/)?.[1]
        ?.split(",")
        ?.map((t) => t.trim());
      let sentiment = response.match(/Sentiment: (.*)/)?.[1];
      let companies = response
        .match(/Companies: (.*)/)?.[1]
        ?.split(",")
        ?.map((t) => t.trim());
      let people = response
        .match(/People: (.*)/)?.[1]
        ?.split(",")
        ?.map((t) => t.trim());
      let stockTickers = response
        .match(/StockTickers: (.*)/)?.[1]
        ?.split(",")
        ?.map((t) => t.trim());
      return {
        summary,
        tags,
        sentiment,
        companies,
        people,
        stockTickers,
      };
    } catch (err) {
      console.error(`Unable to parse JSON from ChatGPT response`);
      console.error(err);
      return response;
    }
  },
};
