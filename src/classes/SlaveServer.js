import mysql from "mysql2/promise";
export default class SlaveServer {
  constructor(user, password, host, database) {
    this.user = user;
    this.password = password;
    this.host = host;
    this.database = database;
  }
  async connect() {
    this.connection = await mysql.createConnection({
      user: this.user,
      password: this.password,
      host: this.host,
      database: this.database,
    });
  }

  async isReplicationRunning() {
    const [rows] = await this.connection.execute("SHOW SLAVE STATUS");
    await this.close();

    if (rows.length > 0) {
      const status = rows[0];
      const ioRunning = status["Slave_IO_Running"];
      const sqlRunning = status["Slave_SQL_Running"];

      if (ioRunning !== "Yes" || sqlRunning !== "Yes") return false;
      return true;
    } else return false;
  }

  async close() {
    if (this.connection) {
      await this.connection.end();
    }
  }
}
