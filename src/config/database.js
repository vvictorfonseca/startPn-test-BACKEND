const dotenv = require('dotenv')

dotenv.config({ path: ".env" })

module.exports = {

  dialect: "postgres",
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE

}
