import {
  parseShellArguments,
  quotePosixArgument,
  type ParseShellOptions,
} from '@lp-labs/shell-arguments';
const options: ParseShellOptions = { maxArguments: 4 };
const values: string[] = parseShellArguments(quotePosixArgument('two words'), options);
// @ts-expect-error budget must be numeric.
parseShellArguments('x', { maxArguments: 'many' });
void values;
