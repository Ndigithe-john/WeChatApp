async function User(Email, pool) {
  if (pool.connected) {
    let results = await pool
      .request()
      .input("Email", Email)
      .execute("Wechat.GetUserByEmail");
    let user = results.recordset[0];
    return user;
  }
}
module.exports = User;
