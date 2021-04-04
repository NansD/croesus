const relationships = require('./relationships.json')
const { StatusCodes } = require('http-status-codes')
const autoBind = require('auto-bind')

function addChildToParent(parent, key, child) {
  if (Array.isArray(parent[key])) {
    parent[key] = [...parent[key], child]
    return parent
  }
  console.error('wrong call to addChildToParent, ', parent[key], 'is not an array')
}

module.exports = class NestedController {
  constructor(collectionName, ParentModel, relationship, relationshipKey) {
    this.collectionName = collectionName
    this.ParentModel = ParentModel
    this.relationship = relationship
    this.relationshipKey = relationshipKey
    autoBind(this)
  }

  async create(req, res, Model, parent, key) {
    const requestBody = req.body
    const document = new Model(addChildToParent(parent, key, requestBody))

    try {
      const result = await Model.findByIdAndUpdate(document._id, document, { new: true })
      return res.status(StatusCodes.OK).json({ document: result })
    } catch (error) {
      console.error(error)
      return res.status(StatusCodes.SERVER_ERROR).json({ error })
    }
  }

  async delete(req, res, parent) {
    // const subDocument = this.checkIfDocumentExistsInParent(req.params.id, parent)
    const newParent = new this.ParentModel(this.deleteInParent(req.params.id, parent))
    try {
      await this.ParentModel.findByIdAndUpdate(newParent._id, newParent, { new: true })
      return res.status(StatusCodes.NO_CONTENT).send()
    } catch (error) {
      console.error('Error while deleting document', JSON.stringify(error))
      return res.status(StatusCodes.SERVER_ERROR).json({ error })
    }
  }

  async update(req, res, parent) {
    // const subDocument = this.checkIfDocumentExistsInParent(req.params.id, parent)
    const newSubDocument = req.body
    const newParent = new this.ParentModel(
      this.updateInParent(req.params.id, newSubDocument, parent)
    )
    try {
      const savedParent = await this.ParentModel.findByIdAndUpdate(newParent._id, newParent, {
        new: true
      })
      return res.status(StatusCodes.OK).json({ document: savedParent })
    } catch (error) {
      console.log('error :', error)
      return res.status(StatusCodes.SERVER_ERROR).json({ error })
    }
  }

  checkIfDocumentExistsInParent(id, parent) {
    let document
    switch (this.relationship) {
      case relationships.ONE_TO_MANY:
        document =
          parent[this.relationshipKey].find(subDocument => String(subDocument._id) === id) || false
        break
      case relationships.ONE_TO_ONE:
        document = parent[this.relationshipKey]._id === id && parent[this.relationshipKey]
        break
      default:
        throw new Error('Invalid relationship', this.relationship)
    }
    return document
  }

  updateInParent(id, newSubDocument, parent) {
    switch (this.relationship) {
      case relationships.ONE_TO_MANY:
        parent[this.relationshipKey] = parent[this.relationshipKey].map(subDocument =>
          String(subDocument._id) === id ? newSubDocument : subDocument
        )
        return parent
      case relationships.ONE_TO_ONE:
        delete parent[this.relationshipKey]
        return parent
      default:
        throw new Error('Invalid relationship', this.relationship)
    }
  }

  deleteInParent(id, parent) {
    switch (this.relationship) {
      case relationships.ONE_TO_MANY:
        parent[this.relationshipKey] = parent[this.relationshipKey].filter(
          subDocument => String(subDocument._id) !== id
        )
        return parent
      case relationships.ONE_TO_ONE:
        delete parent[this.relationshipKey]
        return parent
      default:
        throw new Error('Invalid relationship', this.relationship)
    }
  }
}
