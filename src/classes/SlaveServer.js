import mysql from "mysql2/promise";

export default class SlaveServer {
  constructor(user, password, host, database) {
    this.user = user;
    this.password = password;
    this.host = host;
    this.database = database;
    this.connection = null;
  }

  async connect() {
    try {
      this.connection = await mysql.createConnection({
        user: this.user,
        password: this.password,
        host: this.host,
        database: this.database,
      });
    } catch (error) {
      throw new Error(`Failed to connect to the database: ${error.message}`);
    }
  }

  async isReplicationRunning() {
    if (!this.connection) {
      throw new Error(
        "Database connection to the slave server has not been established."
      );
    }

    try {
      const [rows] = await this.connection.execute("SHOW SLAVE STATUS");

      if (rows.length > 0) {
        const status = rows[0];
        const ioRunning = status["Slave_IO_Running"];
        const sqlRunning = status["Slave_SQL_Running"];

        if (ioRunning !== "Yes") {
          throw new Error(
            "IO process is not running. Check the slave's IO thread."
          );
        } else if (sqlRunning !== "Yes") {
          throw new Error(
            "SQL process is not running. Check the slave's SQL thread."
          );
        }
      } else {
        throw new Error(
          "No replication status information found. The slave server may not be configured properly."
        );
      }
    } catch (error) {
      throw new Error(`Failed to check replication status: ${error.message}`);
    } finally {
      await this.close(); // Ensure the connection is closed
    }
  }

  // Close the database connection
  async close() {
    if (this.connection) {
      try {
        await this.connection.end();
      } catch (error) {
        throw new Error(
          `Failed to close the database connection: ${error.message}`
        );
      }
    }
  }
}
