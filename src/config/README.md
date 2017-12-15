# Docsense Configuration

## Loading Config

By default, docsense will look for your configuration whenever you run it in the following places:

- a package.json property called `docsense`
- a `JSON` or `YAML` "rc file"
  - `.docsenserc`
  - `.docsenserc.yaml`
  - `.docsenserc.json`
  - `docsense.config.js` (as a common JS module)

> Docsense can do this with big thanks to [Comsiconfig](https://github.com/davidtheclark/cosmiconfig)

## Create Config Automatically

```
docsense init
```

You can create a new config file automatically by using `docsense init` at the root of your project.  Docsense will create a `.docsenserc` file for you (in JSON format)

## Config Schema

You can see `docsense.schema.json` located at the root of this project to use with your IDE.
