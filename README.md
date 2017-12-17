# @erickmerchant/checkup

Essentially it looks at all the directories in the current working directory and runs a few checks on them. I wrote this because [this page](https://david-dm.org/erickmerchant) wasn't working. More checks may be added in the future.

## Checks

- compares the output of `npm outdated --json` to the package-lock.json versions
- runs `git status --porcelain`

## Usage

```
npx @erickmerchant/checkup --help
```
