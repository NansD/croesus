const mongoose = require('mongoose');
const functionAndObject = require('./functionAndObject');

module.exports = class Controller {
  constructor(collectionName, model) {
    this.collectionName = collectionName;
    this.Model = mongoose.model(this.collectionName, model);
    this.respond = {
      with: {
        error: {
          creation: {
            db: (document, callback) => {
              return callback(null, {
                headers: {
                  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                statusCode: 500,
                body: JSON.stringify({
                  message: `Error while submitting in collection ${this.Model.modelName} ${JSON.stringify(document)}`,
                }),
              });
            },
          },
          update: {
            db: (document, callback) => {
              return callback(null, {
                headers: {
                  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                statusCode: 500,
                body: JSON.stringify({
                  message: `Error while updating document ${JSON.stringify(document)} in collection ${
                    this.Model.modelName
                  }`,
                }),
              });
            },
          },
          common: {
            db: (callback) => {
              return callback(null, {
                headers: {
                  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                statusCode: 500,
                body: JSON.stringify({
                  message: `Error while performing action in collection ${this.Model.modelName}`,
                }),
              });
            },
            invalidData: (document, callback) => {
              let documentToPrint;
              if (document && document.toObject) {
                documentToPrint = document.toObject();
              } else {
                documentToPrint = JSON.stringify(document);
              }
              return callback(null, {
                headers: {
                  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                statusCode: 400,
                body: JSON.stringify({
                  message: `Incorrect request, ${documentToPrint} didn't pass ${this.Model.name} validation`,
                }),
              });
            },
            notFound: (key, callback) => {
              return callback(null, {
                headers: {
                  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                statusCode: 404,
                body: JSON.stringify({
                  message: `Couldn't find any document matching ${key} in collection ${this.Model.name}`,
                }),
              });
            },
          },
          unauthorized: (callback) => {
            return callback(null, {
              headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
              },
              statusCode: 401,
              body: JSON.stringify({
                message: `Unauthorized. Are you logged in ?`,
              }),
            });
          },
        },
        success: functionAndObject(
          (body, callback) => {
            return callback(null, {
              headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
              },
              statusCode: 200,
              body: JSON.stringify(body),
            });
          },
          {
            creation: (document, callback) => {
              return callback(null, {
                headers: {
                  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                statusCode: 200,
                body: JSON.stringify({
                  message: `Successfully submitted in collection ${this.Model.modelName}`,
                  document: document.toObject(),
                }),
              });
            },
            update: (document, callback) => {
              return callback(null, {
                headers: {
                  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                statusCode: 200,
                body: JSON.stringify({
                  message: `Successfully updated document in collection ${this.Model.modelName}`,
                  document: document.toObject(),
                }),
              });
            },
            deletion: (callback) => {
              return callback(null, {
                headers: {
                  'Access-Control-Allow-Origin': '*', // Required for CORS support to work
                },
                statusCode: 204,
              });
            },
          }
        ),
      },
    };
  }

  async create(event, context, callback) {
    const requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const instance = new this.Model(requestBody);

    await this.validate(instance, callback);

    let document;
    try {
      document = await instance.save();
    } catch (error) {
      console.error(error);
      return this.respond.with.error.creation.db(document, callback);
    }
    return this.respond.with.success.creation(document, callback);
  }

  async update(event, context, callback) {
    const requestBody = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
    const instance = new this.Model(requestBody);

    await this.validate(instance, callback);

    let document;
    try {
      document = this.Model.findByIdAndUpdate(instance._id, instance);
    } catch (error) {
      console.error(error);
      return this.respond.with.error.update.db(document, callback);
    }
    return this.respond.with.success.create(document, callback);
  }

  async validate(instance, callback) {
    try {
      await instance.validate();
    } catch (error) {
      this.respond.with.error.common.invalidData(instance, callback);
    }
  }

  async list(event, context, callback) {
    try {
      const documents = await this.Model.find().sort({ createdAt: 'desc' });
      return callback(null, {
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS support to work
        },
        statusCode: 200,
        body: JSON.stringify({
          documents,
        }),
      });
    } catch (err) {
      console.error('Error while getting mongodb data:', JSON.stringify(err, null, 2));
      return this.respond.with.error.common.db(callback);
    }
  }

  async delete(event, context, callback) {
    const document = await this.checkIfDocumentExistsInDb('_id', event.pathParameters.id, callback);
    try {
      await document.delete();
    } catch (error) {
      console.error('Error while deleting document', JSON.stringify(error));
      return this.respond.with.error.common.db(callback);
    }
    return this.respond.with.success.deletion(callback);
  }

  async findDocumentInDb(key, value) {
    const query = { [key]: value };
    const document = this.Model.findOne(query);
    return document;
  }

  async checkIfDocumentExistsInDb(key, value, callback) {
    const document = await this.findDocumentInDb(key, value);
    if (!document) {
      return this.respond.with.error.common.notFound(value, callback);
    }
    return document;
  }
};
