import { checkServerReachability } from "./helpers/reachable.js";
import SlaveServer from "./classes/SlaveServer.js";

export default async function replicationCheck(replicaConfig) {
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
  Name: *${name}*
  Master host: ${masterHost}
  Slave Host: ${slaveHost}
  ----Error Message----
  ${error.message}
  \n${getCurrentDateTime()}
  `;
    await sendMessageToGroup(telegramBotToken, telegramGroupId, message);
  }
}
