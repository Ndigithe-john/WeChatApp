const mssql = require("mssql");
const config = require("../config/databaseConfig");
async function User(Email) {
  let sql = await mssql.connect(config);
  if (sql.connected) {
    let results = await sql
      .request()
      .input("Email", Email)
      .execute("Wechat.GetUserByEmail");
    let user = results.recordset[0];
    return user;
  }
}
module.exports = User;
