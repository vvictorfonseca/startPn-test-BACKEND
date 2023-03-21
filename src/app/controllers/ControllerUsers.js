const { User } = require('../models')
const { Session } = require('../models')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config({ path: ".env" })

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

      await User.create({ fullName, email, password: passwordHash, confirmPassword: confirmPasswordHash })
      return res.status(201).json({ message: "Usuário criado com sucesso" })
    
    } catch (error) {
      return res.status(500).json({ message: "Algo deu errado na criação de um novo usuário" })
    }
  }

  async login(req, res) {
    const { email, password } = req.body
    const { JWT_SECRET_KEY } = process.env
    const expiresAt = { expiresIn: 60 * 60 * 24 };

    try {
      
      const user = await User.findOne({
        where: {
          email
        }
      })

      if (!user) {
        return res.status(404).json({ message: "Esse usuário não está cadastrado "})
      }

      const isCorrectPassword = bcrypt.compareSync(password, user.password)

      if (!isCorrectPassword) {
        return res.status(404).json({ message: "Senha incorreta" })
      }

      const token = jwt.sign({id: user.id, email: user.email}, JWT_SECRET_KEY, expiresAt)
      await Session.create({ token: token, userId: user.id })

      const data = {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        token: token
      }
      
      return res.status(200).json(data)

    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: "Algo deu errado para login de usuário" })
    }
  }

  async update(req, res) {
    const { fullName, phoneNumber, profilePhoto, email, password } = req.body
    const userId = res.locals.user.id

    try {
      
      const SALT = 10
      const user = await User.findOne({
        where: {
          id: userId
        }
      })
      const isIdenticalPassword = bcrypt.compareSync(password, user.password)

      if (!isIdenticalPassword) {
        const newPasswordHash = bcrypt.hashSync(password, SALT)
        
        await User.update(
          { fullName, phoneNumber, profilePhoto, email, password: newPasswordHash, confirmPassword: bcrypt.hashSync(password, SALT)},
          {
            where: {
              id: userId
            }
          }
        )

        return res.status(201).json({ message: "Usuário atualizado com sucesso"})
      }

      await User.update(
        { fullName, phoneNumber, profilePhoto, email },
        {
          where: {
            id: userId
          }
        }
      )

      return res.status(201).json({ message: "Usuário atualizado com sucesso"})
      
    } catch (error) {
      return res.status(500).json({ message: "Erro ao atualizar usuário" })
    }
  }
}

module.exports = new ControllerUsers()