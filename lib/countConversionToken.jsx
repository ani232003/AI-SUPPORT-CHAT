import { encodingForModel } from "js-tiktoken";

const enc = encodingForModel("gpt-40-mini");

export function countTokens(text) {
    return enc.encode(text).length;
}

export function countConversationTokens(messages) {
    let tokenCount = 0;
    for (const message of messages) {
        tokenCount += 4;
        tokens += enc.encode(message.content).length;
    }
    tokens += 2;
    return tokenCount;
}