import YAML from "yaml";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

import sendMessageToGroup from "./helpers/telegramHandler.js";
import getCurrentDateTime from "./helpers/currentDateTime.js";
import checkAndRunAfter12hour from "./helpers/checkAndRunTask.js";
import replicationCheck from "./replicationCheck.js";
import { reportHour } from "./helpers/environmentVariables.js";
import { reportMessage } from "./reportMessage.js";

function getConfigs() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const filePath = join(__dirname, "..", "config.yaml");
  const configs = fs.readFileSync(filePath, "utf8");
  return YAML.parse(configs);
}

async function main() {
  try {
    const replicaConfigs = getConfigs();
    checkAndRunAfter12hour(reportHour, () =>
      reportMessage(replicaConfigs.configs)
    );

    replicaConfigs.configs.forEach(replicationCheck);
  } catch (error) {
    const message = `SCRIPT ERROR!!!!!
${error.message}
\n${getCurrentDateTime()}
    `;
    await sendMessageToGroup(message);
  }
}

main();
