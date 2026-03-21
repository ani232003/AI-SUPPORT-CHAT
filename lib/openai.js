import OpenAI from "openai"

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_API_KEY, // using your exact env key name
})

export async function summarizeMarkdown(markdown) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            max_tokens: 2000,
            messages: [
                {
                    role: "system",
                    content: "Summarize the following content into clean, concise markdown that can be used to train an AI assistant. The final output must be under 2000 words."
                },
                {
                    role: "user",
                    content: markdown
                }
            ]
        })

        return completion.choices[0].message.content || markdown

    } catch (error) {
        console.error("summarizeMarkdown error:", error.message)
        return markdown
    }
}

export async function chatCompletion(messages, systemPrompt) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.7,
            max_tokens: 1000,
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                ...messages
            ]
        })

        return completion.choices[0].message.content || ""

    } catch (error) {
        console.error("chatCompletion error:", error.message)
        return "Sorry, something went wrong. Please try again."
    }
}

export async function summerizeConversaion(messages){
    try{
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            temperature: 0.3,
            max_tokens: 500,
            messages: [
                {
                    role: "system",
                    content: "Summarize the following conversation into a concise format that captures the main points and context. The summary should be clear and informative, providing an overview of the key topics discussed."
                },
                ...messages            ]
        });
         return completion.choices[0].message.content ?.trim() ?? "";
    } catch(error){
        console.error("summerizeConversaion error:", error.message);
        throw error;
    }
}