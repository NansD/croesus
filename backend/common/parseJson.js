module.exports = function parseJsonClosure(event, context, callback) {
  return function parseJson() {
    const body = JSON.parse(event.body) || {};
    // eslint-disable-next-line no-param-reassign
    event.body = body;
  };
};
