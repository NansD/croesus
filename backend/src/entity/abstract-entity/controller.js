const mongoose = require('../../database')
const { StatusCodes } = require('http-status-codes')
const autoBind = require('auto-bind')
const tryCatch = asyncOperation => {
  return async (...args) => {
    let result, error
    try {
      result = await asyncOperation(...args)
    } catch (errorThrown) {
      error = errorThrown
    }
    return [result, error]
  }
}

function orderByDateDesc(a, b) {
  return new Date(b.submittedAt) - new Date(a.submittedAt)
}

class Controller {
  constructor(collectionName, model) {
    this.collectionName = collectionName
    this.Model = mongoose.model(this.collectionName, model)
    autoBind(this)
  }

  /**
   * Get element based on his internal id
   * @param {Request} req - Express Request Object
   * @param {Response} res - Express Response Object
   */
  async getOne(req, res) {
    const { id } = req.params

    const [error, document] = await this.checkIfDocumentExistsInDb('_id', id)

    if (!document && !error) {
      return res.status(StatusCodes.NOT_FOUND).json({ error, document })
    }
    if (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error, document })
    }

    return res.status(StatusCodes.OK).json({ document: document })
  }

  /**
   * Get elements as raw (no pagination)
   * @param {Request} req - Express Request Object
   * @param {Response} res - Express Response Object
   */
  async getAll(req, res) {
    const [error, documents] = await tryCatch(this.Model.find)()

    if (!documents && !error) {
      return res.status(StatusCodes.NOT_FOUND).json({ error, documents })
    }
    if (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error, documents })
    }

    return res.status(StatusCodes.OK).json({ documents: documents.sort(orderByDateDesc) })
  }

  /**
   * Update element based on his internal id
   * @param {Request} req - Express Request Object
   * @param {Response} res - Express Response Object
   */
  async update(req, res) {
    const { id: elementId } = req.params
    const data = req.body

    const [error, document] = await tryCatch(this.Model.findByIdAndUpdate)(elementId, data, {
      new: true
    })

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error, document })
    }

    return res.status(StatusCodes.OK).json({ document })
  }

  async create(req, res) {
    const data = req.body
    const newDocument = new this.Model(data)
    const [error, document] = await tryCatch(newDocument.save)()

    if (error || !document) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error, document })
    }

    return res.status(StatusCodes.OK).json({ document: newDocument.toObject() })
  }

  async delete(req, res) {
    const { id: elementId } = req.params

    const [error, document] = await tryCatch(this.Model.findByIdAndRemove)(elementId)

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json({ error, document })
    }

    return res.status(StatusCodes.NO_CONTENT).send()
  }

  async findDocumentInDb(key, value) {
    const query = { [key]: value }
    const document = await this.Model.findOne(query)
    return document
  }

  async checkIfDocumentExistsInDb(key, value) {
    const document = await this.findDocumentInDb(key, value)
    let error
    if (!document) {
      error = new Error(`document not found, ${key}, ${value}`)
    }
    return [error, document]
  }

  enrichEventWithDocumentClosure(key, value, eventKey) {
    async function enrichEventWithDocument(req, res, next) {
      const [error, document] = await this.checkIfDocumentExistsInDb(key, value)
      if (error) {
        return res.status(StatusCodes.NOT_FOUND).json({ error })
      }
      req.context[eventKey] = document.toJSON()
      next()
    }
    return enrichEventWithDocument.bind(this)
  }
}

module.exports = { Controller, tryCatch }
