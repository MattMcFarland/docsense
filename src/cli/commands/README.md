# Commands

## Usage

At any time you may use the `--help` or -`h` command.

```
docsense <command> [Options]

Commands:
  docsense build [Options]  Builds static doc site                  [aliases: b]
  docsense init [Options]   Initializes docsense config file (.docsenserc)
                                                                    [aliases: i]
  docsense serve [Options]  Serves up a local docsense app that watches for
                            changes                       [aliases: s, w, watch]

Options:
  --silent, -s   Run silently, logging nothing
  --quiet, -q    Run quietly, logging only warnings
  --verbose, -V  enables verbose logging
  --debug, -D    logs all debug messages, more verbose than verbose.
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]

Examples:
  docsense init          Creates a config file for your project (recommended)
  docsense init --help   See options and examples for using init
  docsense build --help  See options and examples for using build
  docsense serve --help  See options and examples for using serve

```
