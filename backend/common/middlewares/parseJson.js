module.exports = function parseJsonClosure(event) {
  return function parseJson() {
    const body = JSON.parse(event.body) || {};
    event.body = body;
  };
};
