# parallel protractor

We have same 2 unit tests in 3 spec files

- spec.js has both unit tests together
- spec-1.js and spec-2.js have single test each

There are two suites configured in [conf.js](conf.js) - suite "one" runs
spec.js, while suite "spread" runs `spec-1.js` and `spec-2.js`. There are
sharded tests flag in the `conf.js` so when running suite "spread" each
browser instance can execute its own `spec-*.js` file, effectively
executing tests in parallel.

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
