import { Request, Response } from "express";
import OpenAI from "openai";
import { BASE_PROMPT } from "../prompts";
import { reactBaseTemplate } from "../constants";
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const templateController = async (req: Request, res: Response) => {
  const prompt = req.query.prompt as string;
  const response = await openAI.chat.completions.create({
    messages: [
      { role: "user", content: prompt },
      {
        role: "system",
        content:
          "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
      },
    ],
    model: "chatgpt-4o-latest",
    max_tokens: 100,
  });
  // answer can either be node or react
  const answer = response.choices[0].message.content;
  if (answer === "react") {
    res.json({
      prompts: [
        BASE_PROMPT,
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBaseTemplate}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [reactBaseTemplate],
    });
    return;
  }
  console.log({ response });
  res.json({
    success: true,
    response: response.choices[0].message.content,
  });
  return;
};
