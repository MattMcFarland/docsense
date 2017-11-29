const ParseEngine = require('../../../parser/ParseEngine').default
const defaultConfig = require('../../../config/default-config.json')
const fs = require('fs')
const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')
const registerPlugin = require('../../../utils/plugin').registerPlugin
const assert = require('assert')
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
    plugin.exec = plugin.default
    assert(plugin.exec, 'plugin must have a default export')
    assert(plugin.collectionName, 'plugin must export a collectionName')
    parser.on('done', () => resolve(db.getState()))
    registerPlugin(parser, plugin, db)
    parser.emit('addFile:before', db.getState())

    parser.addFile(fileName, sourceCode.toString())
    parser.emit('addFile:after', db.getState())

    parser.emit('done')
  })
}
