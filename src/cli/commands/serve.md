# `docsense serve`
## Usage:

```docsense serve [Options]

Serves up a local docsense app that watches for changes

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
  --root, -r        Directory to start parsing in                [default: "./"]
  --log, -l         Enable logging from the child build process [default: false]

Examples:
  docsense serve                       Hosts a local server, builds docs, and
                                       watches for changes based on the
                                       configuration file (which can be
                                       generated with the init command)
  docsense serve --out out --root lib  Treats the folder "lib" as root. So all
                                       docs are generated from "lib", replacing
                                       "myPackage/lib" with "myPackage"
  docsense serve --log                 Lets you see all of the log output from
                                       the build steps

This uses all of the options found with docsense build, use "docsense build
--help to see more"

```
