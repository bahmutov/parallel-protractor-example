# parallel protractor example

> Running parallel end 2 end tests in using Protractor from the same spec

[![Build status][ci-image] ][ci-url]

[ci-image]: https://travis-ci.org/bahmutov/parallel-protractor-example.png?branch=master
[ci-url]: https://travis-ci.org/bahmutov/parallel-protractor-example

We have same 2 unit tests in 3 spec files

- spec.js has both unit tests together
- spec-1.js and spec-2.js have single test each

There are two suites configured in [conf.js](conf.js) - suite "one" runs
spec.js, while suite "spread" runs `spec-1.js` and `spec-2.js`. There are
sharded tests flag in the `conf.js` so when running suite "spread" each
browser instance can execute its own `spec-*.js` file, effectively
executing tests in parallel.

See config options for parallel protractor run in 
[this blog post](http://blog.yodersolutions.com/run-protractor-tests-in-parallel/)

## Running tests in sequence

```sh
$ nr run-o
running command with prefix "run-o"

> parallel-protractor-example@1.0.0 run-one /Users/gleb/git/parallel-protractor-example
> protractor conf.js --suite=one

Using the selenium server at http://localhost:4444/wd/hub
[launcher] Running 1 instances of WebDriver


  Protractor Demo App
    ✓ should have a title

  Protractor Demo App
    ✓ should add one and two


  2 passing (3s)

[launcher] 0 instance(s) of WebDriver still running
[launcher] chrome #01 passed
```

## Running tests in parallel

```sh
$ nr run-s
running command with prefix "run-s"

> parallel-protractor-example@1.0.0 run-spread /Users/gleb/git/parallel-protractor-example
> protractor conf.js --suite=spread

[launcher] Running 2 instances of WebDriver
.
------------------------------------
[chrome #01-1] PID: 87004
[chrome #01-1] Specs: /Users/gleb/git/parallel-protractor-example/spec-2.js
[chrome #01-1] 
[chrome #01-1] Using the selenium server at http://localhost:4444/wd/hub
[chrome #01-1] 
[chrome #01-1] 
[chrome #01-1]   Protractor Demo App spec-2
    ✓ should have a title
[chrome #01-1] 
[chrome #01-1] 
[chrome #01-1]   1 passing (704ms)
[chrome #01-1] 

[launcher] 1 instance(s) of WebDriver still running
.
------------------------------------
[chrome #01-0] PID: 87003
[chrome #01-0] Specs: /Users/gleb/git/parallel-protractor-example/spec-1.js
[chrome #01-0] 
[chrome #01-0] Using the selenium server at http://localhost:4444/wd/hub
[chrome #01-0] 
[chrome #01-0] 
[chrome #01-0]   Protractor Demo App spec-1
    ✓ should add one and two (2824ms)
[chrome #01-0] 
[chrome #01-0] 
[chrome #01-0]   1 passing (3s)
[chrome #01-0] 

[launcher] 0 instance(s) of WebDriver still running
[launcher] chrome #01-1 passed
[launcher] chrome #01-0 passed
```

## Running protractor with fake spec via preloading

Load the script "parallelize.js" before running protractor using
command `node -r ./parallelize.js node_modules/.bin/protractor conf.js --suite=one`
The script looks at the `conf.js`, finds the suite, then all `describe` blocks inside
and creates "virtual" spec files with each `describe` going into its own virtual spec.
Then it fakes the file system so when Protractor tries to load virtual spec files, they are
found. Here is sample output

```sh
$ nr par
running command with prefix "par"

> parallel-protractor-example@1.0.0 parallel /Users/gleb/git/parallel-protractor-example
> node -r ./parallelize.js node_modules/.bin/protractor conf.js --suite=one

parallelizing, assuming conf file
/Users/gleb/git/parallel-protractor-example/conf.js
suite name "one" 1460734410938
spec "one" filename from conf /Users/gleb/git/parallel-protractor-example/spec.js
found 2 describe blocks in /Users/gleb/git/parallel-protractor-example/spec.js
mock suite filenames [ '/Users/gleb/git/parallel-protractor-example/mock-spec-0.js',
  '/Users/gleb/git/parallel-protractor-example/mock-spec-1.js' ]
loading config file /Users/gleb/git/parallel-protractor-example/conf.js
returning updated config file with mock spec filenames
GlobSync /Users/gleb/git/parallel-protractor-example/mock-spec-0.js
set opts /Users/gleb/git/parallel-protractor-example/mock-spec-0.js
matches [  ] 1
_processSimple /Users/gleb/git/parallel-protractor-example/mock-spec-0.js
lstat on mock spec filename /Users/gleb/git/parallel-protractor-example/mock-spec-0.js
lstat sync on /Users/gleb/git/parallel-protractor-example/mock-spec-0.js
GlobSync /Users/gleb/git/parallel-protractor-example/mock-spec-1.js
set opts /Users/gleb/git/parallel-protractor-example/mock-spec-1.js
matches [  ] 1
_processSimple /Users/gleb/git/parallel-protractor-example/mock-spec-1.js
lstat on mock spec filename /Users/gleb/git/parallel-protractor-example/mock-spec-1.js
lstat sync on /Users/gleb/git/parallel-protractor-example/mock-spec-1.js
[launcher] Running 2 instances of WebDriver
.
------------------------------------
[chrome #01-0] PID: 94669
[chrome #01-0] Specs: /Users/gleb/git/parallel-protractor-example/mock-spec-0.js
[chrome #01-0] 
[chrome #01-0] parallelizing, assuming conf file
[chrome #01-0] /Users/gleb/git/parallel-protractor-example/conf.js
[chrome #01-0] suite name "one" 1460734411058
[chrome #01-0] spec "one" filename from conf /Users/gleb/git/parallel-protractor-example/spec.js
[chrome #01-0] found 2 describe blocks in /Users/gleb/git/parallel-protractor-example/spec.js
[chrome #01-0] mock suite filenames [ '/Users/gleb/git/parallel-protractor-example/mock-spec-0.js',
[chrome #01-0]   '/Users/gleb/git/parallel-protractor-example/mock-spec-1.js' ]
[chrome #01-0] file exists? /Users/gleb/git/parallel-protractor-example/node_modules/build.desc
[chrome #01-0] loading config file /Users/gleb/git/parallel-protractor-example/conf.js
[chrome #01-0] returning updated config file with mock spec filenames
[chrome #01-0] Using the selenium server at http://localhost:4444/wd/hub
[chrome #01-0] loading mock spec module /Users/gleb/git/parallel-protractor-example/mock-spec-0.js
[chrome #01-0] mock spec index 0
[chrome #01-0] 
[chrome #01-0] 
[chrome #01-0]   Protractor Demo App
    ✓ should have a title
[chrome #01-0] 
[chrome #01-0] 
[chrome #01-0]   1 passing (684ms)
[chrome #01-0] 

[launcher] 1 instance(s) of WebDriver still running
.
------------------------------------
[chrome #01-1] PID: 94670
[chrome #01-1] Specs: /Users/gleb/git/parallel-protractor-example/mock-spec-1.js
[chrome #01-1] 
[chrome #01-1] parallelizing, assuming conf file
[chrome #01-1] /Users/gleb/git/parallel-protractor-example/conf.js
[chrome #01-1] suite name "one" 1460734411066
[chrome #01-1] spec "one" filename from conf /Users/gleb/git/parallel-protractor-example/spec.js
[chrome #01-1] found 2 describe blocks in /Users/gleb/git/parallel-protractor-example/spec.js
[chrome #01-1] mock suite filenames [ '/Users/gleb/git/parallel-protractor-example/mock-spec-0.js',
[chrome #01-1]   '/Users/gleb/git/parallel-protractor-example/mock-spec-1.js' ]
[chrome #01-1] file exists? /Users/gleb/git/parallel-protractor-example/node_modules/build.desc
[chrome #01-1] loading config file /Users/gleb/git/parallel-protractor-example/conf.js
[chrome #01-1] returning updated config file with mock spec filenames
[chrome #01-1] Using the selenium server at http://localhost:4444/wd/hub
[chrome #01-1] loading mock spec module /Users/gleb/git/parallel-protractor-example/mock-spec-1.js
[chrome #01-1] mock spec index 1
[chrome #01-1] 
[chrome #01-1] 
[chrome #01-1]   Protractor Demo App
    ✓ should add one and two (2883ms)
[chrome #01-1] 
[chrome #01-1] 
[chrome #01-1]   1 passing (3s)
[chrome #01-1] 

[launcher] 0 instance(s) of WebDriver still running
[launcher] chrome #01-0 passed
[launcher] chrome #01-1 passed
```
