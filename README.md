# @erickmerchant/checkup

Essentially it looks at all the directories in the current working directory and runs a few checks on them. I wrote this because [this page](https://david-dm.org/erickmerchant) wasn't working. More checks may be added in the future.

## Checks

- reports results from `npm audit --json`
- compares the output of `npm outdated --json` to the package-lock.json versions
- runs `npm test`
- runs `git status --porcelain`
- checks for missing and unused dependencies

## Usage

Install it globally or just use npx.

```
npx @erickmerchant/checkup --help
```
