# @lp-labs/shell-arguments

Parses and quotes a bounded POSIX-like argument-string subset. It produces argument arrays only:
there is no shell, process launcher, variable expansion, command substitution, globbing, or `eval`.
Use an operating-system process API with an argument array if a child process is needed.

## Install

```bash
npm install @lp-labs/shell-arguments
```

```js
import { parseShellArguments, quotePosixArguments } from '@lp-labs/shell-arguments';

const args = ['--label', "a user's file.txt", ''];
const encoded = quotePosixArguments(args);
if (JSON.stringify(parseShellArguments(encoded)) !== JSON.stringify(args))
  throw new Error('Round trip failed');
```

## API

- `parseShellArguments(input, options?): string[]` parses whitespace-separated bare, single-quoted,
  or double-quoted arguments. Outside single quotes, backslash quotes the next character. Empty
  quoted strings are preserved.
- `quotePosixArgument(argument): string` quotes one value to be parsed by this package's POSIX-like
  parser; `quotePosixArguments(arguments): string` quotes and joins a list.
- `ParseShellOptions` supports `maxInputLength` (default 16,384 UTF-16 units) and `maxArguments`
  (default 1,024).

Unquoted `; & | < > ( )`, backticks, and `$` are rejected. Expansion is not supported, including
inside double quotes. Single quotes are literal until the closing single quote. This intentionally
small grammar is not identical to every shell's tokenization rules and does not accept shell
operators even when a caller intends them as syntax.

## Errors, customization, and safety

Unmatched quotes, trailing escapes, NUL in output quoting, and unsupported shell syntax throw
`TypeError`; length and argument budgets throw `RangeError`. No partial argument array is returned
after a parse error. To customize token syntax, transform a trusted structured argument array rather
than extending this parser with evaluation. Quoting does not make arbitrary commands safe; never pass
the returned string to a shell when an argument-array process API is available.

## Performance

Parsing and quoting are O(input length + output length) with bounded input and argument counts.

## Support

If this library is useful to you, consider supporting its maintenance with a [donation via PayPal](https://www.paypal.me/LibinPrasanth).

## Author

Created by [Libin Prasanth](https://www.linkedin.com/in/libinprasanth/). Connect on LinkedIn for updates and discussion.
