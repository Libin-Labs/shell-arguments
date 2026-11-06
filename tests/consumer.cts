import { parseShellArguments, quotePosixArguments } from '@lp-labs/shell-arguments';
const result: string[] = parseShellArguments(quotePosixArguments(['a', 'b']));
// @ts-expect-error quote helpers accept arrays of strings.
quotePosixArguments([1]);
void result;
