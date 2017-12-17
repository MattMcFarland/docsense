# `docsense build`
### Usage:


```
docsense build [Options]

Builds static doc site

Options:
  --version         Show version number                                [boolean]
  --silent, -s      Run silently, logging nothing, shorthand for
                    --loglevel=silent                           [default: false]
  --loglevel, --ll  Set the loglevel
       [choices: "silent", "info", "verbose", "silly", "warn"] [default: "info"]
  --help            Show help                                          [boolean]
  --files           File or glob of files that will be parsed.
                                                          [default: "[**/*.js]"]
  --out, -o         Directory your documentation will be generated in
                                                               [default: "docs"]
  --root, -r        Directory to start parsing in               [default: "CWD"]

Examples:
  docsense build                            builds docs using your config file
                                            instead of options (recommended)
  docsense build --out foo                  Docs are generated into the foo
                                            directory
  docsense build --root lib --files         Files matching the glob pattern will
  "**/*.js"                                 be parsed for document generation
  docsense build --loglevel silly           Oververbose logging, useful for
                                            debugging!

```
