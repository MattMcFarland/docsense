//@flow
import logger from 'npmlog'
import pkg from '../package.json'

logger.heading = 'docsense'
logger.info('using', `docsense@${pkg.version}`)
logger.addLevel('success', 2000, { fg: 'green', bold: true })
global.log = logger
