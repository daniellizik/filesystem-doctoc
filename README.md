Other table of contents generators take a single readme file. What if you have several readmes, or many? You can use `filetree-doctoc` to join many readme files in your filesystem tree into a single .md file with a table of contents that matches your file structure.

For now, it only supports github-flavor markdown.

## api

```js
import fileSystemDocToc from 'filesystem-doctoc`

fileSystemDocToc({
  // should be a file that serves as the root of your docs directory
  rootPath: `${__dirname}/docs/readmes`,
  // filepath to specify where you want output to be written
  output: `${__dirname}/docs/dist/index.md`
})
```