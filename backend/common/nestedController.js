const respond = require('./respond');
const relationships = require('./relationships.json');

// eslint-disable-next-line max-params
function addChildToParent(parent, key, child, callback) {
  if (Array.isArray(parent[key])) {
    parent[key] = [...parent[key], child];
    return parent;
  }
  return this.respond.with.error.invalidData(parent, callback);
}

module.exports = class NestedController {
  constructor(collectionName, ParentModel, relationship, relationshipKey) {
    this.collectionName = collectionName;
    this.respond = respond.apply(this);
    this.ParentModel = ParentModel;
    this.relationship = relationship;
    this.relationshipKey = relationshipKey;
  }

  // eslint-disable-next-line max-params
  async create(event, context, callback, Model, parent, key) {
    const requestBody = event.body;
    const document = new Model(addChildToParent(parent, key, requestBody, callback));
    await this.validate(document, callback);

    try {
      console.log('document :', document);
      const res = await Model.findByIdAndUpdate(document._id, document, { new: true });
      console.log('res :', res);
      return this.respond.with.success.creation(res, callback);
    } catch (error) {
      console.error(error);
      return this.respond.with.error.creation.db(document, callback);
    }
  }

  async validate(instance, callback) {
    console.log('instance.toObject() :', instance.toObject());
    try {
      await instance.validate();
    } catch (error) {
      console.log('VALIDATE ERROR', error);
      this.respond.with.error.common.invalidData(instance, callback);
    }
  }

  async delete(event, context, callback, parent) {
    await this.checkIfDocumentExistsInParent(event.pathParameters.id, parent, callback);
    const newParent = new this.ParentModel(this.deleteInParent(event.pathParameters.id, parent, callback));
    await this.validate(newParent, callback);
    try {
      const savedParent = await this.ParentModel.findByIdAndUpdate(newParent._id, newParent, { new: true });
      console.log('savedParent :', savedParent);
      return this.respond.with.success.deletion(callback);
    } catch (error) {
      console.log('error :', error);
      console.error('Error while deleting document', JSON.stringify(error));
      return this.respond.with.error.common.db(callback);
    }
  }

  async update(event, context, callback, parent) {
    await this.checkIfDocumentExistsInParent(event.pathParameters.id, parent, callback);
    const newSubDocument = event.body;
    this.checkIds(event, newSubDocument, callback);
    const newParent = new this.ParentModel(
      this.updateInParent(event.pathParameters.id, newSubDocument, parent, callback)
    );
    await this.validate(newParent, callback);
    try {
      const savedParent = await this.ParentModel.findByIdAndUpdate(newParent._id, newParent, { new: true });
      return this.respond.with.success.update(savedParent, callback);
    } catch (error) {
      console.log('error :', error);
      return this.respond.with.error.common.db(callback);
    }
  }

  // eslint-disable-next-line complexity
  checkIfDocumentExistsInParent(id, parent, callback) {
    let document;
    switch (this.relationship) {
      case relationships.ONE_TO_MANY:
        document = parent[this.relationshipKey].find((subDocument) => String(subDocument._id) === id) || false;
        break;
      case relationships.ONE_TO_ONE:
        document = parent[this.relationshipKey]._id === id && parent[this.relationshipKey];
        break;
      default:
        this.respond.with.error.common.invalidData({ id, parent }, callback);
        throw new Error('Invalid relationship', this.relationship);
    }
    console.log('document :', document);
    if (!document) {
      this.respond.with.error.common.notFound(id, callback);
    }
    return document;
  }

  updateInParent(id, newSubDocument, parent, callback) {
    switch (this.relationship) {
      case relationships.ONE_TO_MANY:
        parent[this.relationshipKey] = parent[this.relationshipKey].map((subDocument) =>
          String(subDocument._id) === id ? newSubDocument : subDocument
        );
        return parent;
      case relationships.ONE_TO_ONE:
        delete parent[this.relationshipKey];
        return parent;
      default:
        this.respond.with.error.common.invalidData({ id, parent }, callback);
        throw new Error('Invalid relationship', this.relationship);
    }
  }

  deleteInParent(id, parent, callback) {
    switch (this.relationship) {
      case relationships.ONE_TO_MANY:
        parent[this.relationshipKey] = parent[this.relationshipKey].filter(
          (subDocument) => String(subDocument._id) !== id
        );
        return parent;
      case relationships.ONE_TO_ONE:
        delete parent[this.relationshipKey];
        return parent;
      default:
        this.respond.with.error.common.invalidData({ id, parent }, callback);
        throw new Error('Invalid relationship', this.relationship);
    }
  }

  checkIds(event, newSubDocument, callback) {
    if (newSubDocument._id !== event.pathParameters.id) {
      this.respond.with.common.invalidData(newSubDocument, callback);
    }
  }
};
