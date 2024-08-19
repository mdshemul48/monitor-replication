import dotenv from "dotenv";
import YAML from "yaml";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import sendMessageToGroup from "./helpers/telegramHandler.js";
import getCurrentDateTime from "./helpers/currentDateTime.js";
import checkAndRunAfter12hour from "./helpers/checkAndRunTask.js";
import replicationCheck from "./replicationCheck.js";

dotenv.config();

const {
  TELEGRAM_ACCESS_TOKEN: telegramBotToken,
  TELEGRAM_GROUP_ID: telegramGroupId,
} = process.env;

function getConfigs() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = join(__dirname, "..", "config.yaml");
  const configs = fs.readFileSync(filePath, "utf8");
  return YAML.parse(configs);
}

async function main() {
  try {
    checkAndRunAfter12hour(async () => {
      const message = `*Script Running!*
      \n${getCurrentDateTime()}`;
      await sendMessageToGroup(telegramBotToken, telegramGroupId, message);
    });

    const replicaConfigs = getConfigs();

    replicaConfigs.configs.forEach(replicationCheck);
  } catch (error) {
    const message = `SCRIPT ERROR!!!!!
${error.message}
\n${getCurrentDateTime()}
    `;
    await sendMessageToGroup(telegramBotToken, telegramGroupId, message);
  }
}

main();
