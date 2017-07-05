import fileSystemDocToc, { writeLine, walk, configurator } from '../src/fileSystemDocToc'
import { lstatSync, mkdirSync } from 'fs'
import { spawnSync } from 'child_process'

let conf = {rootPath: `${__dirname}/fixture`, output: `${__dirname}/output/Home.md`}

beforeEach(() => {
  try {
    const isDir = lstatSync(`${__dirname}/output`).isDirectory()
    if (isDir) {
      spawnSync('rm', ['-rf', `${__dirname}/output`])
      mkdirSync(`${__dirname}/output`)
    }
  }
  catch(e) {
    mkdirSync(`${__dirname}/output`)
  }
})

describe('doc toc generator', () => {
  const tree = walk(`${__dirname}/fixture`)
  it('should gather folders and files', () => {
    expect(tree.toc.length).toBe(16)
  })
  it('should concat file contents', () => {
    expect(tree.md.length).toBe(16)
  })
  it('should not alter file or folder titles, only anchors', () => {
    expect(writeLine(1, 'foo bar')).toBe('* [foo bar](#foo-bar)')
    expect(writeLine(1, 'a & b')).toBe('* [a & b](#a--b)')
  })
  it('should respect indents for nested bullets', () => {
    expect(writeLine(0, 'x')).toBe('* [x](#x)')
    expect(writeLine(1, 'x')).toBe('* [x](#x)')
    expect(writeLine(2, 'x')).toBe('  * [x](#x)')
    expect(writeLine(3, 'x')).toBe('    * [x](#x)')
  })
  it('should respect header levels', () => {
    expect(tree.md.toString().indexOf('### third-level-file')).toBeGreaterThan(-1)
  })
})

describe('configuration', () => {
  const res = configurator(conf)
  it('should receive config object as api entry point', () => {
    expect(res.config.rootPath.indexOf('fixture')).toBeGreaterThan(-1)
    expect(res.config.output.indexOf('output')).toBeGreaterThan(-1)
  })
  it('should write the file to output config', () => {
    fileSystemDocToc(conf)
    lstatSync(conf.output)
  })
})

// roadmap feature

// describe('ordering', () => {
//   conf = Object.assign({}, conf, {
//     order: [
//       {
//         name: 'a',
//         order: ['dog', 'cat']
//       }
//     ]
//   })
//   const res = configurator(conf)
//   it('should override ordering if supplied', () => {
//     console.log(res.text)
//   })
// })