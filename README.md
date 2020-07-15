# d2l-custom-teacher-course-creation

[![NPM version](https://img.shields.io/npm/v/@brightspace-ui/custom-teacher-course-creation.svg)](https://www.npmjs.org/package/@brightspace-ui/custom-teacher-course-creation)
[![Dependabot badge](https://flat.badgen.net/dependabot/BrightspaceUI/custom-teacher-course-creation?icon=dependabot)](https://app.dependabot.com/)
[![Build status](https://travis-ci.com/@brightspace-ui/custom-teacher-course-creation.svg?branch=master)](https://travis-ci.com/@brightspace-ui/custom-teacher-course-creation)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

## Installation

To install from NPM:

```shell
npm install @brightspace-ui/custom-teacher-course-creation
```

## Usage

```html
<script type="module">
    import '@brightspace-ui/custom-teacher-course-creation/custom-teacher-course-creation.js';
</script>
<d2l-custom-teacher-course-creation>My element</d2l-custom-teacher-course-creation>
```

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

This component uses the [semantic-release](https://github.com/semantic-release/semantic-release) library to manage GitHub releases. The commit message format for initiating releases follows the [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

Prefixing your commit with `fix(scope):` will increment the `PATCH` version, prefixing with `feat(scope):` will increment the `MINOR` version, and prefixing the *footer* of the commit with `BREAKING CHANGE:` will increment the `MAJOR` version. Note, `(scope)` is optional. Two examples are below:

`feat: Adding error page` will increment the `MINOR` version.

```
fix(api): Updating to new API call signature


BREAKING CHANGE: The new API call is incompatible with the old signature
```
will increment the `MAJOR` version. *IMPORTANT:* There are two blank lines in between the `type(scope): <subject>` message and the `BREAKING_CHANGE` message. This is important because the `BREAKING_CHANGE` portion needs to be in the *footer* of the commit message, not the *body*.
