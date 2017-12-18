# `docsense build`
### Usage:


```
docsense build [Options]

Builds static doc site

Options:
  --silent, -s   Run silently, logging nothing
  --quiet, -q    Run quietly, logging only warnings
  --verbose, -V  enables verbose logging
  --debug, -D    logs all debug messages, more verbose than verbose.
  --files, -f    File or glob of files that will be parsed.
                                                          [default: "[**/*.js]"]
  --out, -o      Directory your documentation will be generated in
                                                               [default: "docs"]
  --root, -r     Directory to start parsing in                  [default: "CWD"]
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]

Examples:
  docsense build                            builds docs using your config file
                                            instead of options (recommended)
  docsense build --out foo                  Docs are generated into the foo
                                            directory
  docsense build --root lib --files         Files matching the glob pattern will
  "**/*.js"                                 be parsed for document generation
  docsense build --debug                    Oververbose logging

```
