import TelegramBot from "node-telegram-bot-api";

export default async function sendMessageToChannel(
  botToken,
  groupId,
  message
) {
  const bot = new TelegramBot(botToken);
  await bot.sendMessage(groupId, message);
}
