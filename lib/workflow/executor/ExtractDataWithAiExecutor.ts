import {ExecutionEnvironment} from "@/types/executor";
import {ExtractDataWithAITask} from "@/lib/workflow/task/ExtractDataWithAI";
import prisma from "@/lib/prisma";
import {symmetricDecrypt} from "@/lib/encyption";
//import OpenAI from "openai";

// ----------------------------------------------------------------------

export async function ExtractDataWithAiExecutor(environment: ExecutionEnvironment<typeof ExtractDataWithAITask>): Promise<boolean> {
    try {
        const credentials = environment.getInput("Credentials");
        if (!credentials) {
            environment.log.error("Input -> credentials not defined");
        }

        const prompt = environment.getInput("Prompt");
        if (!prompt) {
            environment.log.error("Input -> prompt not defined");
        }

        const content = environment.getInput("Content");
        if (!content) {
            environment.log.error("Input -> content not defined");
        }


        // Get credentials from the database
        const credential = await prisma.credential.findUnique({
            where: {id: credentials}
        });

        if (!credential) {
            environment.log.error("Credential not found");
            return false;
        }

        const plainCredentialValue = symmetricDecrypt(credential.value);
        if (!plainCredentialValue) {
            environment.log.error("Failed to decrypt credential value");
            return false;
        }

        /*const openai = new OpenAI({
            apiKey: plainCredentialValue,
        });
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: "You are a web scraper helper that extract data from HTML or text. " +
                        "You will be given a prompt and a piece of text or HTML content as input and also the prompt with the data you have to extract. " +
                        "The response should always be only the extracted data as a JSON array or object, without any additional words or explanations." +
                        "Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return an empty JSON array." +
                        "Work only with the provided content and ensure the output is always a valid JSON array without any text."
                },
                {
                    role: "user",
                    content: content,
                },
                {
                    role: "user",
                    content: prompt,
                }
            ],
            temperature: 1,
        });

        environment.log.info(`Prompt tokens: ${response.usage?.prompt_tokens}`);
        environment.log.info(`Completion tokens: ${response.usage?.completion_tokens}`);

        const result = response.choices[0].message?.content;
        if (!result) {
            environment.log.error("Empty response from AI");
            return false;
        }*/


        const mockExtractedData = {
            usernameSelector: "#username",
            passwordSelector: "#password",
            loginButtonSelector: "body > div > form > input.btn.btn-primary",
        };
        environment.setOutput("Extracted data", JSON.stringify(mockExtractedData, null, 4));


        // environment.setOutput("Extracted data", result);

        return true;
    } catch (error: any) {
        environment.log.error(error.message);
        return false;
    }
}
