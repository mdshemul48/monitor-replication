import dotenv from "dotenv";
import isReachable from "./helpers/reachable.js";
import SlaveServer from "./classes/SlaveServer.js";
import sendMessageToGroup from "./helpers/telegramHandler.js";

dotenv.config();

async function main() {
  const telegramBotToken = process.env.TELEGRAM_ACCESS_TOKEN;
  const telegramGroupId = process.env.TELEGRAM_GROUP_ID;

  const masterHost = process.env.MASTER_HOST;

  const slaveHost = process.env.SLAVE_HOST;
  const slaveUser = process.env.SLAVE_DB_USER;
  const slavePassword = process.env.SLAVE_DB_PASSWORD;
  const slaveDatabase = process.env.SLAVE_DB_DATABASE;

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
    await sendMessageToGroup(telegramBotToken, telegramGroupId, error.message);
  }
}

main();
