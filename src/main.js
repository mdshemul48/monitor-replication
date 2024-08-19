import dotenv, { config } from "dotenv";
import YAML from "yaml";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import SlaveServer from "./classes/SlaveServer.js";
import sendMessageToGroup from "./helpers/telegramHandler.js";
import { checkServerReachability } from "./helpers/reachable.js";
import getCurrentDateTime from "./helpers/currentDateTime.js";

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

async function replicationCheck(replicaConfig) {
  const {
    name,
    credentials: {
      master_host: masterHost,
      slave_host: slaveHost,
      slave_db_user: slaveUser,
      slave_db_password: slavePassword,
      slave_db_database: slaveDatabase,
    },
  } = replicaConfig;

  try {
    checkServerReachability(masterHost, "Master");
    checkServerReachability(slaveHost, "Slave");

    const slave = new SlaveServer(
      slaveUser,
      slavePassword,
      slaveHost,
      slaveDatabase
    );

    await slave.connect();

    await slave.isReplicationRunning();
  } catch (error) {
    const message = `🚨⚠️REPLICA STOPPED⚠️🚨 
Name: ${name}
Master host: ${masterHost}
Slave Host: ${slaveHost}
----Error Message----
${error.message}
\n${getCurrentDateTime()}
`;
    await sendMessageToGroup(telegramBotToken, telegramGroupId, message);
  }
}

async function main() {
  try {
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
