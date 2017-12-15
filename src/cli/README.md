# CLI

Docsense has three basic commands to help facilitate the generation of docs.  [init](./commands/init.ts) for bootstrapping your documentation, [build](./commands/build.ts) for running a production build, and [serve]('./commmands/serve.ts) for serving up a dev version that automatically updates as your code changes.

## Usage

At any time you may use the `--help` or -`h` command.

```
docsense <command>

Commands:
  docsense build [Options]  Builds static doc site
  docsense init  [Options]  Initializes docsense config file
                               (.docsenserc)
  docsense serve [Options]  Serves up a local docsense app that
                               watches for changes

Options:
  -v, --version  Show version number                       [boolean]
  -h, --help     Show help                                 [boolean]

```
You may also run `--help` with every command to get more information.

## Initializing docsense

While it is not necessary, you can have docsense create your `.docsenserc` configuration file for you, using `docsense init`

Once you run `docsense init`, you should have a `.docsenserc` file in your project with some starter settings:

```json

{
  "out": "./docs",
  "main": "./README",
  "files": [
    "./index.js"
  ]
}
```

The initial settings will only parse the single `index.js` file for documentation, look for a `README.md` (in all caps!) file as your front page, and create all of the documentation into `docs` when you run `build` or `serve`

> The .md extension is assumed to be on your readme, and will break if you use `README.md`, so use `README` instead.

The `out`, `main`, and `files` can be overridden however if you pass them in as options into the command line.


### Tips

* If you do not want to expose your internal APIs, you can change the `files` section to only include the files you wish to expose.

* Configuration can be overriden in the command line (see `--help`)

* If you have a library of many functions, you can include your library like this:

```json

{
  "files": [
    "./lib/**/*.js"
  ]
}
```

## Building documentation

Once you have your `.docsenserc` file, you can run `docsense build` at any time to create the documentation.  The **build** will do the following:

- Create all necessary directories in the `out` folder
- Create static HTML, CSS, and JS of your documentation

## Watching for changes

If you would like to develop your documentation and see updates right away, you can use `docsense serve` - this will watch for cahnges and run the `build` step and refresh your browser.


