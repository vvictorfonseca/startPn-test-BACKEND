const { Service, sequelize } = require("../models")
const { QueryTypes } = require('sequelize') 

class ControllerService {

  async storage(req, res) {
    const { description, code, serviceCode, price, unity, generalObservation } = req.body
    
    try {
      const service = await Service.findOne({
        where: {
          code
        }
      })

      if (!description || !code || !serviceCode || !price || !unity || !generalObservation) {
        return res.status(401).json({ message: "Todos os campos devem ser preenchidos" })
      }

      if (service) {
        return res.status(401).json({ message: "Já existe um serviço com este código!" })
      }

      await Service.create({ description, code, serviceCode, price, unity, generalObservation })
      return res.status(201).json({ message: "Serviço criado com sucesso" })
    
    } catch (error) {
      return res.status(500).json({ message: "Algo deu errado na criação de um novo serviço" })
    }
  }

  async get(req, res) {
    try {
      
      const services = await Service.findAll()

      if (services.lenght == 0) {
        return res.status(422).json({ message: "Nenhum serviço cadastrado" })
      } 

      return res.status(200).json(services)
    
    } catch (error) {
      return res.status(500).json({ message: "Algo deu errado para carregar os serviços" })
    }
  }

  async getServicesByDescription(req, res) {
    const { string } = req.params

    try {

      const services = await sequelize.query(
        'SELECT * FROM "Services" WHERE lower (description) LIKE :string',
        {
          replacements: { string: string + '%'},
          type: QueryTypes.SELECT
        }
      )

      return res.status(200).json(services)
      
    } catch (error) {
      return res.status(500).json({ message: "Algo deu errado para carregar os serviços" })
    }
  }

  async update(req, res) {
    const { id } = req.params
    const { description, code, serviceCode, price, unity, generalObservation } = req.body
    
    try {

      const service = await Service.findByPk(id)

      if (!service) {
        return res.status(404).json({ message: "Serviço não encontrado" })
      }

      await Service.update(
        { description, code, serviceCode, price, unity, generalObservation },
        {
          where: {
            id
          },
        }
      )

      return res.status(201).json({ message: "Serviço atualizado com sucesso" })
    
    } catch (error) {
      return res.status(500).json({ message: "Algo deu errado para atualizar o serviço" })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      
      const service = await Service.findByPk(id)

      if (!service) {
        return res.status(404).json({ message: "Serviço não encontrado" })
      }

      await Service.destroy({
        where: {
          id
        }
      })

      return res.status(200).json({ message: "Serviço deletado com sucesso" })

    } catch (error) {
      return res.status(500).json({ message: "Algo deu errado para deletar o serviço" })
    }
  }
}

module.exports = new ControllerService()