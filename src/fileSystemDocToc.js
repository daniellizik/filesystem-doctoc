import { readFileSync, readdirSync, lstatSync, writeFileSync } from 'fs'
import path from 'path'

export const defaultConfig = {
  rootPath: __dirname,
  output: __dirname,
  order: false
}

export const writeLine = (depth, title, cb) => {
  const indent = new Array(depth).fill('').join('  ')
  const href = title.replace(/[/=?&]/g, '').replace(/[\s\r\n]/g, '-')
  return typeof cb === 'function' 
     ? cb(indent, title, href) 
     : `${indent}* [${title}](#${href})`
}

/**
 * @param {object} branch 
 * @param {object} order - overrides
 * @param {string} pathPart 
 * @param {object} bucket 
 * @param {number} depth 
 */
export const walk = (branch, order, pathPart, bucket = {toc: [], md: []}, depth = 1) => {
  return readdirSync(branch).reduce((acc, f, i) => {
    const currPath = `${branch}/${f}`
    const dir = pathPart ? f : `${pathPart}/${f}`
    const isFolder = lstatSync(currPath).isDirectory()
    const {ext, name} = path.parse(f)
    const header = new Array(depth + 1).fill('#').join('')
    if (isFolder) {
      const nextAcc = {
        md: [...acc.md, writeLine(depth, name, (indent, title, href) => `${header} ${href}`)],
        toc: [...acc.toc, writeLine(depth, f)]
      }
      return walk(currPath, order, f, nextAcc, depth + 1)
    } else if (ext === '.md') {
      const md = readFileSync(currPath, 'utf8')
      return {
        toc: [...acc.toc, writeLine(depth, name)],
        md: [
          ...acc.md,
          writeLine(depth, name, (indent, title, href) => `${header} ${href}\n${md}\n`)
        ]
      }
    } else {
      return acc
    }
  }, bucket)
}

/**
 * configurator
 * @param {object} preConfig - user config
 * @prop {string} rootPath - root folder to read from
 * @prop {string} output - filepath to write concatenated .md
 * @prop {object} order - overrides ordering of TOC
 */
export const configurator = (preConfig) => {
  const config = Object.assign({}, defaultConfig, preConfig)
  const {toc, md} = walk(config.rootPath, config.order)
  const concatToc = toc.join('\n')
  const concatMd = md.join('\n')
  const text = `${concatToc}\n\n${concatMd}`
  return {text, config}
}

export default (preConfig) => {
  const {text, config} = configurator(preConfig)
  writeFileSync(config.output, text)
}