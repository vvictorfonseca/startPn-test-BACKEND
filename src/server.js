const dotenv = require('dotenv')
const server = require('./app')

dotenv.config({ path: ".env" })

const PORT = process.env.PORT

server.listen(PORT, () => console.log(`Server listening on port ${PORT}`))