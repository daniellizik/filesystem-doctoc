You can use `filetree-doctoc` to join many readme files in a directory into a single .md file with a table of contents that matches your file structure.

For now, it only supports github-flavor markdown.

## api

```js
import fileSystemDocToc from 'filesystem-doctoc'

fileSystemDocToc({
  // should be a file that serves as the root of your docs directory
  rootPath: `${__dirname}/docs/readmes`,
  // filepath to specify where you want output to be written
  output: `${__dirname}/docs/dist/index.md`
})
```

## roadmap

- add cli
- add ordering config, to override default ordering of bullet items per folder