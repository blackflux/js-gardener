import robo from 'robo-config';

export default (logger, cwd) => (async () => {
  let result;
  try {
    result = await robo(cwd);
  } catch (e) {
    logger.error(e.message);
    throw e;
  }
  result.forEach((l) => logger.error(l));
  if (result.length !== 0) {
    throw result;
  }
})();
