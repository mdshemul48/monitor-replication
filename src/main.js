import dotenv from "dotenv";
import isReachable from "./helpers/reachable.js";
import SlaveServer from "./classes/SlaveServer.js";

dotenv.config();

async function main() {
  const masterHost = process.env.MASTER_HOST;

  const slaveHost = process.env.SLAVE_HOST;
  const slaveUser = process.env.SLAVE_DB_USER;
  const slavePassword = process.env.SLAVE_DB_PASSWORD;
  const slaveDatabase = process.env.SLAVE_DB_DATABASE;
  try {
    if (!(await isReachable(masterHost))) {
      throw "Master unreachable! Maybe master server offline.";
    } else if (!(await isReachable(slaveHost))) {
      throw "Slave unreachable! Maybe master server offline.";
    }

    const slave = new SlaveServer(
      slaveUser,
      slavePassword,
      slaveHost,
      slaveDatabase
    );

    await slave.connect();

    if (!(await slave.isReplicationRunning())) {
      throw "Replication stopped working. Please check the slave server status.";
    }
  } catch (error) {
    console.log(error);
  }
  console.log("GG bois");
}

main();
