const { User } = require('../models')
const bcrypt = require('bcrypt')

class ControllerUsers {
  
  async storage(req, res) {
    const { fullName, email, password, confirmPassword } = req.body
    
    try {
      const SALT = 10
      const userAlreadyExist = await User.findOne({
        where: {
          email
        }
      })

      if (userAlreadyExist) {
        return res.status(409).json({ message: "Esse usuário já está cadastrado "})
      }
      
      if (!fullName || !email || !password || !confirmPassword) {
        return res.status(401).json({ message: "Todos os campos devem ser preenchidos" })
      }

      if (password !== confirmPassword) {
        return res.status(401).json({ message: "As senhas devem ser iguais" })
      }

      const passwordHash = bcrypt.hashSync(password, SALT)
      const confirmPasswordHash = bcrypt.hashSync(confirmPassword, SALT)
      console.log("haha", passwordHash)

      await User.create({ fullName, email, password: passwordHash, confirmPassword: confirmPasswordHash })
      return res.status(201).json({ message: "Usuário criado com sucesso" })
    
    } catch (error) {
      return res.status(500).json({ message: "Algo deu errado na criação de um novo usuário" })
    }
  }
}

module.exports = new ControllerUsers()