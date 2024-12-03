import OpenAI from "openai";
import { BASE_PROMPT, getSystemPrompt } from "../prompts";
import { nodeBaseTemplate, reactBaseTemplate } from "../constants";
import { Request, Response } from "express";
const openAI = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
export const templateController = async (req: Request, res: Response) => {
  const prompt = req.body.prompt as string;
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
  if (answer === "node") {
    res.json({
      prompts: [
        `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBaseTemplate}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
      ],
      uiPrompts: [nodeBaseTemplate],
    });
    return;
  }
  res.status(403).json({ message: "You cant access this" });
  return;
};

export const chatController = async (req: Request, res: Response) => {
  const messages = req.body.messages;
  const response = await openAI.chat.completions.create({
    messages: [
      ...messages.map((m: string) => ({ role: "user", content: m })),
      {
        role: "system",
        content: getSystemPrompt(),
      },
    ],
    model: "chatgpt-4o-latest",
    max_tokens: 8000,
  });

  res.json({
    success: true,
    response: response.choices[0].message.content,
  });
};
