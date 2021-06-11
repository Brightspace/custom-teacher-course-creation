# d2l-tcc and d2l-tcc-admin

[![Dependabot badge](https://flat.badgen.net/dependabot/Brightspace/custom-teacher-course-creation?icon=dependabot)](https://app.dependabot.com/)
[![CI Badge](https://github.com/Brightspace/custom-teacher-course-creation/workflows/CI/badge.svg)](https://github.com/Brightspace/custom-teacher-course-creation/actions?query=workflow%3ACI)
[![Release Badge](https://github.com/Brightspace/custom-teacher-course-creation/workflows/release/badge.svg)](https://github.com/Brightspace/custom-teacher-course-creation/actions?query=workflow%3Arelease)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/BrightspaceUI/actions/tree/master/semantic-release)


**Properties:**

| Property | Type | Description |
|--|--|--|
|currentPage |string | [Page Constants](https://github.com/Brightspace/custom-teacher-course-creation/blob/master/src/constants.js#L1) |

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
# lint, unit test
npm test

# lint only
npm run lint

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
# then navigate to `http://localhost:9876/debug.html`
npm run test:headless:watch
```

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

This component uses the [semantic-release](https://github.com/BrightspaceUI/actions/tree/master/semantic-release) GitHub action to manage GitHub releases. The commit message format for initiating releases is specified in that [semantic-release](https://github.com/BrightspaceUI/actions/tree/master/semantic-release) GitHub action.

Supported commit prefixes:
| Commit prefix        | Version Increase |
| -------------------- | ---------------- |
| `fix:`               | `PATCH`          |
| `perf:`              | `PATCH`          |
| `feat:`              | `MINOR`          |
| `BREAKING CHANGE:`   | `MAJOR`          |

Example commit: `feat: Adding error page` will increment the `MINOR` version.
