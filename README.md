## Docsense

Docsense is a pluggable and customizable AST to documentation generator which
parses ECMASCIPT 2015+ using
[Babylon](https://github.com/babel/babel/tree/master/packages/babylon),

> 🤖 **It is still in early development and currently not operational** 🤖

### Development

:muscle: Clone the project, then run `yarn` to install all dependencies.

```
git clone https://github.com/MattMcFarland/docsense
```

```
yarn
```

### Scripts

There are a number of scripts that may be run using `yarn` - the ones that
should work independent of developer environments are as follows:

--------------------------------------
| Command      | Description         |
| ------------ | ------------------- |
| `yarn test`  | Runs all unit tests |
| `yarn build` | Compiles source     |
| `yarn docs`  | Runs the compiled code against this project |
| `yarn dev-docs` | Watches `src/generator` for changes, building the new documentation on changes. This will not work unless docs have already been built first. |
--------------------------

### Debugging

This project may be debugged with [VSCode](https://code.visualstudio.com/), and has not been tested with other
IDEs.  You can set breakpoints within the source code, press `F5` and run.  The debug mode will basically run `docs` against this project, generating the `db.json` (and eventually the docs) as if you were to run `docsense` against this project in production.

### Architecture
Docsense will eventualy run in the command line against the `process.cwd()` of the project a user has it installed in as a module.  As of now, it only runs against this project, parsing all of the code, then creating a database which may be queried by the document generator.  The document generator is currently unfinished, so after running `yarn docs` - you may run `yarn dev-docs` which will runs a local server that hosts the generated documentation, updating automatically as you make changes to the generator scripts found in `src/generator`

```
Execution ->
  Read .docsenserc Config ->
    Generate AST ->
      Execute all plugins ->
        Plugin visitors create a database ->
          Static Docs are generated
```

### LICENSE

MIT
