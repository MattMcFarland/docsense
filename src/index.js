// @flow
import './logger'
import getConfig from './config'
import { fatalError } from './utils/common'
import { setupCorePlugins } from './utils/plugin'
import { parseFiles } from './utils/parse'

getConfig()
  .then(setupCorePlugins)
  .then(parseFiles)
  .catch(fatalError)
