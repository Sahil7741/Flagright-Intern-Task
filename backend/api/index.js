const handlerPromise = import('../index.js');

module.exports = async function handler(req, res) {
  const { default: appHandler } = await handlerPromise;
  return appHandler(req, res);
};
