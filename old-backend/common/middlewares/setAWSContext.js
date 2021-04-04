module.exports = function setAWSContextClosure(event, context) {
  return function setAWSContext() {
    context.callbackWaitsForEmptyEventLoop = false;
  };
};
