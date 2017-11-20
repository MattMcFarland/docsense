import logger from 'npmlog'
logger.heading = 'docsense'
logger.info('using', `docsense@${pkg.version}`)

export default () => logger
