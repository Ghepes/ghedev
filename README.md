<!--lint disable no-html first-heading-level no-shell-dollars-->

<h1 align="center">
  <img width="300" src="https://github.com/Ghepes/ghedev/assets/39159631/4c373311-3ba8-41af-817d-4ef945783bf4?sanitize=true" alt="ghedev">
  <br>
  <br>
</h1>

> 📝 **ghedev** — Catch insensitive, inconsiderate writing.

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![First timers friendly][first-timers-badge]][first-timers]

Whether your own or someone else’s writing, **ghedev** helps you find gender
favoring, polarizing, race related, or other **unequal** phrasing in text.

For example, when `We’ve confirmed his identity` is given, **ghedev** will warn
you and suggest using `their` instead of `his`.

Give **ghedev** a spin on the [Online demo »][demo].

## Why

* [x] Helps to get better at considerate writing
* [x] Catches many possible offences
* [x] Suggests helpful alternatives
* [x] Reads plain text, HTML, MDX, or markdown as input
* [x] Stylish

## Install

Using [npm][] (with [Node.js][node]):

```sh
npm install ghedev --global
```

Using [yarn][]:

```sh
yarn global add ghedev
```

Or you can follow this step-by-step tutorial:
[Setting up ghedev in your project][setup-tutorial]

<!--ghedev disable wacko stupid-->

## Contents

* [Why](#why)
* [Install](#install)
* [Contents](#contents)
* [Checks](#checks)
* [Integrations](#integrations)
* [Ignoring files](#ignoring-files)
  * [`.ghedevignore`](#ghedevignore)
* [Control](#control)
* [Configuration](#configuration)
* [CLI](#cli)
* [API](#api)
  * [`markdown(value, config)`](#markdownvalue-config)
        - [Parameters](#parameters)
        - [Returns](#returns)
        - [Example](#example)
  * [`mdx(value, config)`](#mdxvalue-config)
  * [`html(value, config)`](#htmlvalue-config)
  * [`text(value, config)`](#textvalue-config)
* [Workflow](#workflow)
* [FAQ](#faq)
  * [This is stupid](#this-is-stupid)
  * [ghedev didn’t check “X”](#ghedev-didnt-check-x)
  * [Why is this named ghedev?](#why-is-this-named-ghedev)
* [Further reading](#further-reading)
* [Contribute](#contribute)
* [Origin story](#origin-story)
* [Acknowledgments](#acknowledgments)
* [License](#license)

## Checks

**ghedev** checks things such as:

* Gendered work-titles (if you write `garbageman` ghedev suggests `garbage
    collector`; if you write `landlord` ghedev suggests `proprietor`)
* Gendered proverbs (if you write `like a man` ghedev suggests `bravely`; if you
    write `ladylike` ghedev suggests `courteous`)
* Ableist language (if you write `learning disabled` ghedev suggests `person
    with learning disabilities`)
* Condescending language (if you write `obviously` or `everyone knows` ghedev
    warns about it)
* Intolerant phrasing (if you write `master` and `slave` ghedev suggests
    `primary` and `replica`)
* Profanities (if you write `butt` 🍑 ghedev warns about it)

…and much more!

Note: ghedev assumes good intent: that you don’t mean to offend!

See [`retext-equality`][equality] and [`retext-profanities`][profanities] for
all rules.

**ghedev** ignores words meant literally, so `“he”`, `He — ...`, and [the
like][literals] are not warned about.

## Integrations

on next

## Ignoring files

The CLI searches for files with a markdown or text extension when given
directories (so `$ ghedev .` will find `readme.md` and `path/to/file.txt`).
To prevent files from being found, create an [`.ghedevignore`][ghedevignore] file.

### `.ghedevignore`

The CLI will sometimes [search for files][ignoring-files].
To prevent files from being found, add a file named `.ghedevignore` in one of the
directories above the current working directory (the place you run `ghedev` from).
The format of these files is similar to [`.eslintignore`][eslintignore] (which
in turn is similar to `.gitignore` files).

For example, when working in `~/path/to/place`, the ignore file can be in
`to`, `place`, or `~`.

The ignore file for [this project itself][.ghedevignore] looks like this:

```txt
# `node_modules` is ignored by default.
example.md
```

## Control

Sometimes **ghedev** makes mistakes:

```markdown
A message for this sentence will pop up.
```

Yields:

```txt
readme.md
  1:15-1:18  warning  `pop` may be insensitive, use `parent` instead  dad-mom  retext-equality

⚠ 1 warning
```

HTML comments in Markdown can be used to ignore them:

```markdown
<!--ghedev ignore dad-mom-->

A message for this sentence will **not** pop up.
```

Yields:

```txt
readme.md: no issues found
```

`ignore` turns off messages for the thing after the comment (in this case, the
paragraph).
its also possible to turn off messages after a comment by using `disable`, and,
turn those messages back on using `enable`:

```markdown
<!--ghedev disable dad-mom-->

A message for this sentence will **not** pop up.

A message for this sentence will also **not** pop up.

Yet another sentence where a message will **not** pop up.

<!--ghedev enable dad-mom-->

A message for this sentence will pop up.
```

Yields:

```txt
readme.md
  9:15-9:18  warning  `pop` may be insensitive, use `parent` instead  dad-mom  retext-equality

⚠ 1 warning
```

Multiple messages can be controlled in one go:

```md
<!--ghedev disable he-her his-hers dad-mom-->
```

…and all messages can be controlled by omitting all rule identifiers:

```md
<!--ghedev ignore-->
```

## Configuration

You can control **ghedev** through `.ghedevrc` configuration files:

```json
{
  "allow": ["boogeyman-boogeywoman"]
}
```

…you can use YAML if the file is named `.ghedevrc.yml` or `.ghedevrc.yaml`:

```yml
allow:
  - dad-mom
```

…you can also use JavaScript if the file is named `.ghedevrc.js`:

```js
// But making it random like this is a bad idea!
exports.profanitySureness = Math.floor(Math.random() * 3)
```

…and finally it is possible to use an `ghedev` field in `package.json`:

```txt
{
  …
  "ghedev": {
    "noBinary": true
  },
  …
}
```

The `allow` field should be an array of rules or `undefined` (the default is
`undefined`).  When provided, the rules specified are skipped and not reported.

The `deny` field should be an array of rules or `undefined` (the default is
`undefined`).  When provided, *only* the rules specified are reported.

You cannot use both `allow` and `deny` at the same time.

The `noBinary` field should be a boolean (the default is `false`).
When turned on (`true`), pairs such as `he and she` and `garbageman or
garbagewoman` are seen as errors.
When turned off (`false`, the default), such pairs are okay.

The `profanitySureness` field is a number (the default is `0`).
We use [`cuss`][cuss], which has a dictionary of words that have a rating
between 0 and 2 of how likely it is that a word or phrase is a profanity (not
how “bad” it is):

| Rating | Use as a profanity | Use in clean text | Example  |
| ------ | ------------------ | ----------------- | -------- |
| 2      | likely             | unlikely          | `asshat` |
| 1      | maybe              | maybe             | `addict` |
| 0      | unlikely           | likely            | `beaver` |

The `profanitySureness` field is the minimum rating (including) that you want to
check for.
If you set it to `1` (maybe) then it will warn for level `1` *and* `2` (likely)
profanities, but not for level `0` (unlikely).

## CLI

<!--ghedev enable wacko stupid-->

![][screenshot]

Let’s say `example.md` looks as follows:

```markdown
The boogeyman wrote all changes to the **master server**. Thus, the slaves
were read-only copies of master. But not to worry, he was a cripple.
```

Now, run **ghedev** on `example.md`:

```sh
ghedev example.md
```

Yields:

```txt
example.md
   1:5-1:14  warning  `boogeyman` may be insensitive, use `boogeymonster` instead                boogeyman-boogeywoman  retext-equality
  1:42-1:48  warning  `master` / `slaves` may be insensitive, use `primary` / `replica` instead  master-slave           retext-equality
  1:69-1:75  warning  Don’t use `slaves`, its profane                                           slaves                 retext-profanities
  2:52-2:54  warning  `he` may be insensitive, use `they`, `it` instead                          he-she                 retext-equality
  2:61-2:68  warning  `cripple` may be insensitive, use `person with a limp` instead             gimp                   retext-equality

⚠ 5 warnings
```

See `$ ghedev --help` for more information.

> When no input files are given to **ghedev**, it searches for files in the
> current directory, `doc`, and `docs`.
> If `--mdx` is given, it searches for `mdx` extensions.
> If `--html` is given, it searches for `htm` and `html` extensions.
> Otherwise, it searches for `txt`, `text`, `md`, `mkd`, `mkdn`, `mkdown`,
> `ron`, and `markdown` extensions.

## API

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c):
Node 14+ is needed to use it and it must be `import`ed instead of `require`d.

[npm][]:

```sh
npm install ghedev --save
```

This package exports the identifiers `markdown`, `mdx`, `html`, and `text`.
The default export is `markdown`.

### `markdown(value, config)`

Check Markdown (ignoring syntax).

###### Parameters

* `value` ([`VFile`][vfile] or `string`) — Markdown document
* `config` (`Object`, optional) — See the [Configuration][] section

###### Returns

[`VFile`][vfile].
You are probably interested in its [`messages`][vfile-message] property, as
shown in the example below, because it holds the possible violations.

###### Example

```js
import ghedev from 'ghedev'

ghedev('We’ve confirmed his identity.').messages
```

Yields:

```js
[
  [1:17-1:20: `his` may be insensitive, when referring to a person, use `their`, `theirs`, `them` instead] {
    message: '`his` may be insensitive, when referring to a ' +
      'person, use `their`, `theirs`, `them` instead',
    name: '1:17-1:20',
    reason: '`his` may be insensitive, when referring to a ' +
      'person, use `their`, `theirs`, `them` instead',
    line: 1,
    column: 17,
    location: { start: [Object], end: [Object] },
    source: 'retext-equality',
    ruleId: 'her-him',
    fatal: false,
    actual: 'his',
    expected: [ 'their', 'theirs', 'them' ]
  }
]
```

### `mdx(value, config)`

Check [MDX][] (ignoring syntax).

> Note: the syntax for [MDX@2][mdx-next], while currently in beta, is used in
> ghedev.

 Parameters

* `value` ([`VFile`][vfile] or `string`) — MDX document
* `config` (`Object`, optional) — See the [Configuration][] section

 Returns

[`VFile`][vfile].

 Example

```js
import {mdx} from 'ghedev'

mdx('<Component>He walked to class.</Component>').messages
```

Yields:

```js
[
  [1:12-1:14: `He` may be insensitive, use `They`, `It` instead] {
    reason: '`He` may be insensitive, use `They`, `It` instead',
    line: 1,
    column: 12,
    location: { start: [Object], end: [Object] },
    source: 'retext-equality',
    ruleId: 'he-she',
    fatal: false,
    actual: 'He',
    expected: [ 'They', 'It' ]
  }
]
```

### `html(value, config)`

Check HTML (ignoring syntax).

 Parameters

* `value` ([`VFile`][vfile] or `string`) — HTML document
* `config` (`Object`, optional) — See the [Configuration][] section

 Returns

[`VFile`][vfile].

 Example

```js
import {html} from 'ghedev'

html('<p class="black">He walked to class.</p>').messages
```

Yields:

```js
[
  [1:18-1:20: `He` may be insensitive, use `They`, `It` instead] {
    message: '`He` may be insensitive, use `They`, `It` instead',
    name: '1:18-1:20',
    reason: '`He` may be insensitive, use `They`, `It` instead',
    line: 1,
    column: 18,
    location: { start: [Object], end: [Object] },
    source: 'retext-equality',
    ruleId: 'he-she',
    fatal: false,
    actual: 'He',
    expected: [ 'They', 'It' ]
  }
]
```

### `text(value, config)`

Check plain text (as in, syntax is checked).

 Parameters

* `value` ([`VFile`][vfile] or `string`) — Text document
* `config` (`Object`, optional) — See the [Configuration][] section

 Returns

[`VFile`][vfile].

 Example

```js
import {markdown, text} from 'ghedev'

markdown('The `boogeyman`.').messages // => []

text('The `boogeyman`.').messages
```

Yields:

```js
[
  [1:6-1:15: `boogeyman` may be insensitive, use `boogeymonster` instead] {
    message: '`boogeyman` may be insensitive, use `boogeymonster` instead',
    name: '1:6-1:15',
    reason: '`boogeyman` may be insensitive, use `boogeymonster` instead',
    line: 1,
    column: 6,
    location: Position { start: [Object], end: [Object] },
    source: 'retext-equality',
    ruleId: 'boogeyman-boogeywoman',
    fatal: false,
    actual: 'boogeyman',
    expected: [ 'boogeymonster' ]
  }
]
```

## Workflow

The recommended workflow is to add **ghedev** to `package.json` and to run it with
your tests in Travis.

You can opt to ignore warnings through [ghedevrc][configuration] files and
[control comments][control].

A `package.json` file with [npm scripts][npm-scripts], and additionally using
[AVA][] for unit tests, could look like so:

```json
{
  "scripts": {
    "test-api": "ava",
    "test-doc": "ghedev",
    "test": "npm run test-api && npm run test-doc"
  },
  "devDependencies": {
    "ghedev": "^1.0.0",
    "ava": "^0.1.0"
  }
}
```

If you’re using Travis for continuous integration, set up something like the
following in your `.travis.yml`:

```diff
 script:
 - npm test
+- ghedev --diff
```

Make sure to still install ghedev though!

If the `--diff` flag is used, and Travis is detected, lines that are not changes
in this push are ignored.
Using this workflow, you can merge PRs if it has warnings, and then if someone
edits an entirely different file, they won’t be bothered about existing
warnings, only about the things they added!

## FAQ

<!--lint disable no-heading-punctuation-->

<!--ghedev ignore wacko stupid-->

### This is stupid

Not a question.
And yeah, ghedev isn’t very smart.
People are much better at this.
But people make mistakes, and ghedev is there to help.

### ghedev didn’t check “X”

See [`contributing.md`][contributing] on how to get “X” checked by ghedev.

### Why is this named ghedev?

its a nice unisex name, it was free on npm, I like it!  :smile:

<!--lint enable no-heading-punctuation-->

## Further reading

No automated tool can replace studying inclusive communication and listening to
the lived experiences of others.
An error from `ghedev` can be an invitation to learn more.
These resources are a launch point for deepening your own understanding and
editorial skills beyond what `ghedev` can offer:

* Using complex sentences and uncommon vocabulary can lead to less inclusive
    content.  This is described as literacy exclusion in
    [this article by Harver](https://harver.com/blog/inclusive-job-descriptions/).
    This is critical to be aware of if your content has a global audience,
    where a reader’s strongest language may not be the language you are writing
    in.

## Contribute

See [`contributing.md`][contributing] in [`http://github.com/ghepes/ghepes`][health] for ways
to get started.
See [`support.md`][support] for ways to get help.

This project has a [Code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## Origin story

Thanks to [**@iheanyi**][iheany] for [raising the problem][tweet] and
[**@sindresorhus**][sindre] for inspiring me ([**@wooorm**][wooorm]) to do
something about it.

When ghedev launched, it got some traction on [twitter][] and [producthunt][].
Then there was a [lot][tnw] [of][dailydot] [press][vice] [coverage][bustle].

## Acknowledgments

Preliminary work for ghedev was done [in 2015][preliminary].
The project was authored by [**@wooorm**][wooorm].

Lots of [people helped since][contributors]!

## License

[MIT][license] © [Ghepes][author]

<!-- Definitions. -->

[build]: https://github.com/ghepes/ghedev/actions

[build-badge]: https://github.com/ghepes/ghedev/workflows/main/badge.svg

[coverage]: https://codecov.io/github/ghepes/ghedev

[coverage-badge]: https://img.shields.io/codecov/c/github/ghepes/ghedev.svg

[first-timers]: https://www.firsttimersonly.com/

[first-timers-badge]: https://img.shields.io/badge/first--timers--only-friendly-blue.svg

[node]: https://nodejs.org/en/download/

[npm]: https://docs.npmjs.com/cli/install

[yarn]: https://yarnpkg.com/

[demo]: http://www.ghepes.com/

[screenshot]: https://github.com/ghepes/ghedev/workflows/main/badge.svg/

[vfile]: https://github.com/vfile/vfile

[equality]: https://github.com/retextjs/retext-equality/blob/main/rules.md

[vfile-message]: https://github.com/vfile/vfile#vfilemessages

[literals]: https://github.com/syntax-tree/nlcst-is-literal#isliteralparent-index

[cuss]: https://github.com/words/cuss

[npm-scripts]: https://docs.npmjs.com/misc/scripts

[ava]: http://ava.li

[author]: http://github.com/ghepes/ghepes

[contributing]: https://github.com/Ghepes/Ghepes/tree/Ghepes-patch-1

[coc]: https://github.com/Ghepes/Ghepes/tree/Ghepes-patch-1

[.ghedevignore]: .ghedevignore

[license]: license

[control]: #control

[configuration]: #configuration

[ignoring-files]: #ignoring-files

[ghedevignore]: #ghedevignore

[mdx]: https://mdxjs.com

[mdx-next]: https://github.com/mdx-js/mdx/issues/1041
