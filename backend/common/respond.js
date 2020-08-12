const functionAndObject = require('./functionAndObject');

module.exports = function respond() {
  return {
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
                message: `Error while submitting in collection ${this.collectionName} ${JSON.stringify(document)}`,
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
                  this.collectionName
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
                message: `Error while performing action in collection ${this.collectionName}`,
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
                message: `Incorrect request, ${documentToPrint} didn't pass ${this.collectionName} validation`,
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
                message: `Couldn't find any document matching ${key} in collection ${this.collectionName}`,
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
                message: `Successfully submitted in collection ${this.collectionName}`,
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
                message: `Successfully updated document in collection ${this.collectionName}`,
                document: document && document.toObject && document.toObject(),
              }),
            });
          },
          getOne: (document, callback) => {
            return callback(null, {
              headers: {
                'Access-Control-Allow-Origin': '*', // Required for CORS support to work
              },
              statusCode: 200,
              body: JSON.stringify({
                message: `Successfully fetched document in collection ${this.collectionName}`,
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
};
