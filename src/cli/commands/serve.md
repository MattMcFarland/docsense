# `docsense serve`
## Usage:

```
docsense serve [Options]

Serves up a local docsense app that watches for changes

Options:
  --silent, -s   Run silently, logging nothing
  --quiet, -q    Run quietly, logging only warnings
  --verbose, -V  enables verbose logging
  --debug, -D    logs all debug messages, more verbose than verbose.
  --files, -f    File or glob of files that will be parsed.
                                                          [default: "[**/*.js]"]
  --out, -o      Directory your documentation will be generated in
                                                               [default: "docs"]
  --root, -r     Directory to start parsing in                   [default: "./"]
  --log, -l      Enable logging from the child build process    [default: false]
  -v, --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]

Examples:
  docsense serve                Hosts a local server, builds docs, and watches
                                for changes based on the configuration file
                                (which can be generated with the init command)
  docsense serve -o out -r lib  Treats the folder "lib" as root. So all docs are
                                generated from "lib", replacing "myPackage/lib"
                                with "myPackage"
  docsense serve --log          Lets you see all of the log output from the
                                build steps

```
