import SlaveServer from "./classes/SlaveServer.js";
import getCurrentDateTime from "./helpers/currentDateTime.js";
import { checkServerReachability } from "./helpers/reachable.js";
import sendMessageToGroup from "./helpers/telegramHandler.js";

export const reportMessage = async (replicaConfigs) => {
  const replicationInformation = await replicaConfigs.map(
    async (replicaConfig) => {
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

        const replicationInfo = await slave.replicationInfo();

        const keyValueString = Object.entries(replicationInfo)
          .map(([key, value]) => `${key.replaceAll("_", " ")}: ${value}`)
          .join("\n");

        return `
Name: *${name}*
Master host: ${masterHost}
Slave Host: ${slaveHost}
----Replication Update----
${keyValueString}
    `;
      } catch (error) {
        return `🚨⚠️REPLICA STOPPED⚠️🚨 
    Name: *${name}*
    Master host: ${masterHost}
    Slave Host: ${slaveHost}
    ----Error Message----
    ${error.message}
    `;
      }
    }
  );

  const replicationInfo = (await Promise.all(replicationInformation)).join(
    "\n----------"
  );
  const message = `*Script Running!*
  ${replicationInfo}
  \n${getCurrentDateTime()}`;
  await sendMessageToGroup(message);
};
