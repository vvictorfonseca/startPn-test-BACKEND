const { Session } = require('../models')

class ControllerSessions {
  
  async getByUserId(req, res) {
    const { userId } = req.params

    try {
      const session = await Session.findOne({
        where: {
          userId
        }
      })

      if (!session) {
        return res.status(401).json({ message: "Nenhuma sessão encontrada para este usuário" })
      }

      return res.status(200).json({ message: "Usuário está logado"})

    } catch (error) {
      return res.status(500).json({ message: "Algo deu errado para carregar as sessions" })
    }
  }

  async delete(req, res) {
    const { userId } = req.params

    try {
      
      await Session.destroy({
        where: {
          userId
        }
      })

      return res.status(200).json({ message: "Sessão apagada com sucesso" })
    
    } catch (error) {
      return res.status(500).json({ message: "Algo deu errado para apagar as sessions" })
    }
  }
}

module.exports = new ControllerSessions()