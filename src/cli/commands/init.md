# `docsense init`
## Usage:

```
docsense init [Options]

Initializes docsense config file (.docsenserc)

Options:
  --version         Show version number                                [boolean]
  --silent, -s      Run silently, logging nothing, shorthand for
                    --loglevel=silent                           [default: false]
  --loglevel, --ll  Set the loglevel
       [choices: "silent", "info", "verbose", "silly", "warn"] [default: "info"]
  --help            Show help                                          [boolean]
  --dir             directory to add rc file                      [default: "."]
  --out             where docs will be written when using docsense build
                                                             [default: "./docs"]
  --main            main markdown file (without .md extension)
                                                           [default: "./README"]
  --files           files to generate documentation on (can be glob patterns)
                                                               [default: ["./"]]

Examples:
  mkdir foo && docsense init --dir foo  puts config file in the foo dir
  docsense init                         initializes config with the default
                                        settings
  docsense init --main ./manual.md      Configures docsense to use ./manual.md
                                        as the home page
  docsense init --out ./documentation   Configures docsense to build to
                                        "./documentation" by default

```
