import dotenv from "dotenv";
import isReachable from "./helpers/reachable.js";
import SlaveServer from "./classes/SlaveServer.js";
import sendMessageToGroup from "./helpers/telegramHandler.js";

dotenv.config();

async function main() {
  const {
    TELEGRAM_ACCESS_TOKEN: telegramBotToken,
    TELEGRAM_GROUP_ID: telegramGroupId,
    MASTER_HOST: masterHost,
    SLAVE_HOST: slaveHost,
    SLAVE_DB_USER: slaveUser,
    SLAVE_DB_PASSWORD: slavePassword,
    SLAVE_DB_DATABASE: slaveDatabase,
  } = process.env;

  if (
    !telegramBotToken ||
    !telegramGroupId ||
    !masterHost ||
    !slaveHost ||
    !slaveUser ||
    !slavePassword ||
    !slaveDatabase
  ) {
    console.error("Missing required environment variables.");
    process.exit(1);
  }

  try {
    if (!(await isReachable(masterHost))) {
      throw new Error(
        `Master server at ${masterHost} is unreachable. It might be offline or there could be a network issue.`
      );
    } else if (!(await isReachable(slaveHost))) {
      throw new Error(
        `Slave server at ${slaveHost} is unreachable. It might be offline or there could be a network issue.`
      );
    }

    const slave = new SlaveServer(
      slaveUser,
      slavePassword,
      slaveHost,
      slaveDatabase
    );

    await slave.connect();

    await slave.isReplicationRunning();
  } catch (error) {
    try {
      await sendMessageToGroup(
        telegramBotToken,
        telegramGroupId,
        error.message
      );
    } catch (sendError) {
      console.error(
        `Failed to send message to Telegram group: ${sendError.message}`
      );
    }
  }
}

main();
