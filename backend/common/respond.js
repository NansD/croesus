const functionAndObject = require('./functionAndObject');

module.exports = {
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
          if (document instanceof this.Model) {
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
