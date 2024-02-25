#!/usr/bin/env node
// @ts-ignore
import fs from 'node:fs'
// @ts-ignore
import process from 'node:process'
// @ts-ignore
import {URL} from 'node:url'
// @ts-ignore
import notifier from 'update-notifier'
// @ts-ignore
import supportsColor from 'supports-color'
// @ts-ignore
import meow from 'meow'
// @ts-ignore
import {engine} from 'unified-engine'
// @ts-ignore
import {unified} from 'unified'
// @ts-ignore
import rehypeParse from 'rehype-parse'
// @ts-ignore
import remarkParse from 'remark-parse'
// @ts-ignore
import remarkFrontmatter from 'remark-frontmatter'
// @ts-ignore
import remarkGfm from 'remark-gfm'
// @ts-ignore
import remarkMdx from 'remark-mdx'
// @ts-ignore
import retextEnglish from 'retext-english'
// @ts-ignore
import remarkRetext from 'remark-retext'
// @ts-ignore
import rehypeRetext from 'rehype-retext'
// @ts-ignore
import vfileReporter from 'vfile-reporter'
// @ts-ignore
import retextEquality from 'retext-equality'
// @ts-ignore
import retextProfanities from 'retext-profanities'
// @ts-ignore
import unifiedDiff from 'unified-diff'
import {filter} from './filter.js'

/** @type {import('type-fest').PackageJson} */
const pack = JSON.parse(
  // @ts-ignore
  String(fs.readFileSync(new URL('package.json', import.meta.url)))
)

const textExtensions = [
  'txt',
  'text',
  'md',
  'markdown',
  'mkd',
  'mkdn',
  'mkdown',
  'ron'
]
const htmlExtensions = ['htm', 'html']
const mdxExtensions = ['mdx']

// Update messages.
// @ts-ignore
/** @ts-expect-error: `package.json` is fine. */
notifier({pkg: pack}).notify()

// Set-up meow.
const cli = meow(
  [
    'Usage: ghedev [<glob> ...] [options ...]',
    '',
    'Options:',
    '',
    '  -w, --why               output sources (when available)',
    '  -q, --quiet             output only warnings and errors',
    '  -t, --text              treat input as plain-text (not markdown)',
    '  -l, --html              treat input as html (not markdown)',
    '      --mdx               treat input as mdx (not markdown)',
    '  -d, --diff              ignore unchanged lines (affects Travis only)',
    '      --reporter=REPORTER use a custom vfile-reporter',
    '  --stdin                 read from stdin',
    '',
    'When no input files are given, searches for markdown and text',
    'files in the current directory, `doc`, and `docs`.',
    '',
    'Examples',
    '  $ echo "His network looks good" | ghedev --stdin',
    '  $ ghedev *.md !example.md',
    '  $ ghedev'
  ].join('\n'),
  {
    importMeta: import.meta,
    flags: {
      version: {type: 'boolean', alias: 'v'},
      help: {type: 'boolean', alias: 'h'},
      stdin: {type: 'boolean'},
      text: {type: 'boolean', alias: 't'},
      mdx: {type: 'boolean'},
      html: {type: 'boolean', alias: 'l'},
      diff: {type: 'boolean', alias: 'd'},
      reporter: {type: 'string'},
      quiet: {type: 'boolean', alias: 'q'},
      why: {type: 'boolean', alias: 'w'}
    }
  }
)

// Set-up.
const extensions = cli.flags.html
  ? htmlExtensions
  : cli.flags.mdx
  ? mdxExtensions
  : textExtensions
const defaultGlobs = ['{docs/**/,doc/**/,}*.{' + extensions.join(',') + '}']
/** @type {boolean|undefined} */
let silentlyIgnore
/** @type {string[]|undefined} */
let globs

if (cli.flags.stdin) {
  if (cli.input.length > 0) {
    throw new Error('Do not pass globs with `--stdin`')
  }
} else if (cli.input.length === 0) {
  globs = defaultGlobs
  silentlyIgnore = true
} else {
  globs = cli.input
}

engine(
  {
    processor: unified(),
    files: globs,
    extensions,
    configTransform: transform,
    out: false,
    output: false,
    rcName: '.ghedevrc',
    packageField: 'ghedev',
    color: Boolean(supportsColor.stderr),
    reporter: cli.flags.reporter || vfileReporter,
    reporterOptions: {
      verbose: cli.flags.why
    },
    quiet: cli.flags.quiet,
    ignoreName: '.ghedevignore',
    silentlyIgnore,
    frail: true,
    defaultConfig: transform({})
  },
  // @ts-ignore
  function (error, code) {
    // @ts-ignore
    if (error) console.error(error.message)
    process.exit(code)
  }
)

/**
 * @param {import('./index.js').OptionsObject} [options]
 */
function transform(options = {}) {
  /** @type {import('unified').PluggableList} */
  let plugins = [
    retextEnglish,
    [retextProfanities, {sureness: options.profanitySureness}],
    [retextEquality, {noBinary: options.noBinary}]
  ]

  if (cli.flags.html) {
    plugins = [rehypeParse, [rehypeRetext, unified().use({plugins})]]
  } else if (cli.flags.mdx) // @ts-ignore
    {
    // @ts-expect-error: types are having a hard time for bridges.
    plugins = [remarkParse, remarkMdx, [remarkRetext, unified().use({plugins})]]
  } else if (!cli.flags.text) {
    plugins = // @ts-ignore
      [
      // @ts-expect-error: hush.
      // @ts-ignore
      remarkParse,
      remarkGfm,
      [remarkFrontmatter, ['yaml', 'toml']],
      // @ts-expect-error: types are having a hard time for bridges.
      [remarkRetext, unified().use({plugins})]
    ]
  }

  plugins.push([filter, {allow: options.allow, deny: options.deny}])

  // Hard to check.
  /* c8 ignore next 3 */
  if (cli.flags.diff) {
    plugins.push(unifiedDiff)
  }

  return {plugins}
}
