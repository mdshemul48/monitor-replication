import dotenv from "dotenv";
dotenv.config();

export const {
  TELEGRAM_ACCESS_TOKEN: telegramBotToken,
  TELEGRAM_GROUP_ID: telegramGroupId,
  REPORT_HOUR: reportHour,
} = process.env;
