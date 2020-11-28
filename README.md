# posthtml-external-link

<img align="right" width="220" height="200" title="PostHTML logo" src="http://posthtml.github.io/posthtml/logo.svg">

[![Version](https://img.shields.io/npm/v/posthtml-external-link.svg?style=flat-square)](https://www.npmjs.com/package/posthtml-external-link)
[![License](https://img.shields.io/npm/l/posthtml-external-link.svg?style=flat-square)](./LICENSE)
[![Build using TypeScript](https://img.shields.io/badge/definitions-TypeScript-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

A [PostHTML](https://posthtml.org) plugin to add `rel="external noopener nofollow"` and `"target=_blank"` to all external links automatically, for privacy and SEO. [Read more](https://developer.mozilla.org/en-US/docs/Web/HTML/Link_types).

## Installations

```bash
$ npm i -D posthtml-external-link
$ yarn add posthtml-external-link -D # If you prefer yarn
```

## Usage

Since `posthtml-external-link` is a [PostHTML](https://posthtml.org) plugin, just add `posthtml-external-link` to PostHTML plugins array.

```js
const posthtml = require('posthtml');
const { posthtmlExternalLink } = require('posthtml-external-link');

posthtml([
  // Other PostHTML plugins
  postHtmlExternalLink({
    // Here goes options
  }),
  // Other PostHTML plugins
]).process(source/* input html */)
  .then(result => console.log(result.html))
```

## Options

```js
postHtmlExternalLink({
  exclude: ['exclude1.com', 'exclude2.com'],
  noreferrer: false
}),
```

#### exclude (`string | string[]`)

Exclude hostname. Specify subdomain when applicable.

> `exclude1.com` does not apply to `www.exclude1.com` nor `en.exclude1.com`.

#### noreferrer (`boolean`)

Whether to add `noreferrer` to external links' `rel` attribute.

## Maintainer

**posthtml-external-link** © [Sukka](https://github.com/SukkaW), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by Sukka with help from contributors ([list](https://github.com/SukkaW/posthtml-external-link/contributors)).

> [Personal Website](https://skk.moe) · [Blog](https://blog.skk.moe) · GitHub [@SukkaW](https://github.com/SukkaW) · Telegram Channel [@SukkaChannel](https://t.me/SukkaChannel) · Twitter [@isukkaw](https://twitter.com/isukkaw) · Keybase [@sukka](https://keybase.io/sukka)
