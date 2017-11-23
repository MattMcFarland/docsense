const ParseEngine = require('../../../parser/ParseEngine').default
const defaultConfig = require('../../../config/default-config.json')
const fs = require('fs')
const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')

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
    parser.on('done', () => resolve(db.getState()))

    plugin(parser, db)

    parser.addFile(fileName, sourceCode.toString())
    parser.emit('done')
  })
}
