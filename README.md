# d2l-tcc and d2l-tcc-admin

[![Dependabot badge](https://flat.badgen.net/dependabot/Brightspace/custom-teacher-course-creation?icon=dependabot)](https://app.dependabot.com/)
[![Build status](https://travis-ci.com/brightspace/custom-teacher-course-creation.svg?branch=master)](https://travis-ci.com/@brightspace-ui/custom-teacher-course-creation)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

**Properties:**

| Property | Type | Description |
|--|--|--|
| | | |

**Accessibility:**

To make your usage of `d2l-custom-teacher-course-creation` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| | |

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

### Running the demos

To start an [es-dev-server](https://open-wc.org/developing/es-dev-server.html) that hosts the demo page and tests:

```shell
npm start
```

### Linting

```shell
# eslint and lit-analyzer
npm run lint

# eslint only
npm run lint:eslint

# lit-analyzer only
npm run lint:lit
```

### Testing

```shell
# lint, unit test and visual-diff test
npm test

# lint only
npm run lint

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
# then navigate to `http://localhost:9876/debug.html`
npm run test:headless:watch
```

### Visual Diff Testing

This repo uses the [@brightspace-ui/visual-diff utility](https://github.com/BrightspaceUI/visual-diff/) to compare current snapshots against a set of golden snapshots stored in source control.

```shell
# run visual-diff tests
npm run test:diff

# subset of visual-diff tests:
npm run test:diff -- -g some-pattern

# update visual-diff goldens
npm run test:diff:golden
```

Golden snapshots in source control must be updated by Travis CI. To trigger an update, press the "Regenerate Goldens" button in the pull request `visual-difference` test run.

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

This component uses the [semantic-release](https://github.com/semantic-release/semantic-release) library to manage GitHub releases. The commit message format for initiating releases follows the [ESLint Convention](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-eslint).

Supported commit prefixes:
| Commit prefix | Version Increase |
| ------------- | ---------------- |
| `Docs:`       | `PATCH`          |
| `New:`        | `PATCH`          |
| `Fix:`        | `PATCH`          |
| `Update:`     | `MINOR`          |
| `Breaking:`   | `MAJOR`          |

Example commit: `Update: Adding error page` will increment the `MINOR` version.
