module.exports = function parseJsonClosure(event) {
  return function parseJson() {
    if (typeof event.body === 'object') {
      // in case body is already parsed
      return;
    }
    const body = JSON.parse(event.body || '{}') || {};
    event.body = body;
  };
};
