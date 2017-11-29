const ParseEngine = require('../../../parser/ParseEngine').default
const defaultConfig = require('../../../config/default-config.json')
const fs = require('fs')
const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')
const registerPlugin = require('../../../utils/plugin').registerPlugin

module.exports.testPlugin = (initialState, fileName) => (
  plugin,
  sourceCode
) => {
  return new Promise((resolve, reject) => {
    const db = low(new Memory())
    const parser = new ParseEngine('babylon', {
      sourceType: 'module',
      ...defaultConfig,
    })

    db.setState(initialState)
    plugin.exec = plugin
    parser.on('done', () => resolve(db.getState()))
    registerPlugin(parser, plugin, db)

    parser.addFile(fileName, sourceCode.toString())
    parser.emit('done')
  })
}
