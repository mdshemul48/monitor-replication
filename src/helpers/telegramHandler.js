import TelegramBot from "node-telegram-bot-api";
import getCurrentDateTime from "./currentDateTime.js";

export default async function sendMessageToChannel(botToken, groupId, message) {
  const bot = new TelegramBot(botToken);
  await bot.sendMessage(groupId, message + `\n\n${getCurrentDateTime()}`);
}
