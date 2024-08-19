import TelegramBot from "node-telegram-bot-api";
import { telegramBotToken, telegramGroupId } from "./environmentVariables.js";

export default async function sendMessageToChannel(message) {
  const bot = new TelegramBot(telegramBotToken);
  await bot.sendMessage(telegramGroupId, message, { parse_mode: "Markdown" });
}
