const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config({ path: ".env" })

module.exports =  async (req, res, next) => {
  
  const { authorization } = req.headers
  
  const token = authorization?.replace("Bearer ", "").trim()

  if (!token) {
    return res.status(401).json({ message: "Token não encontrado"})
  }

  try {
    
    const key = process.env.JWT_SECRET_KEY;
    const user = jwt.verify(token, key)

    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" })
    }

    res.locals.user = user
  
  } catch (error) {
    return res.status(500).json({ message: "Token inválido"})
  }

  next()
}