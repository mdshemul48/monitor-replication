import dotenv from "dotenv";
import isReachable from "./helpers/reachable.js";

dotenv.config();

async function main() {
  const masterHost = process.env.MASTER_HOST;

  const slaveHost = process.env.SLAVE_HOST;
  const slaveUser = process.env.SLAVE_DB_USER;
  const slavePassword = process.env.SLAVE_DB_PASSWORD;
  const slaveDatabase = process.env.SLAVE_DB_DATABASE;

  if (!(await isReachable(masterHost))) {
    throw "Master unreachable! Maybe master server offline.";
  } else if (!(await isReachable(slaveHost))) {
    throw "Slave unreachable! Maybe master server offline.";
  }


  
}

main();
