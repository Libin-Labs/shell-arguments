export interface ParseShellOptions {
  readonly maxInputLength?: number;
  readonly maxArguments?: number;
}
export function parseShellArguments(input: string, options: ParseShellOptions = {}): string[] {
  if (typeof input !== 'string' || input.length > (options.maxInputLength ?? 16_384))
    throw new RangeError('Shell argument string exceeds limit');
  const result: string[] = [];
  let value = '';
  let started = false;
  let quote: "'" | '"' | null = null;
  for (let i = 0; i < input.length; i++) {
    const char = input[i]!;
    if (quote === "'") {
      if (char === "'") quote = null;
      else value += char;
      continue;
    }
    if (char === '\\') {
      if (i + 1 >= input.length) throw new TypeError('Trailing escape');
      value += input[++i]!;
      started = true;
      continue;
    }
    if (quote === '"') {
      if (char === '"') quote = null;
      else if (char === '$' || char === '`')
        throw new TypeError(`Unsupported shell expansion: ${char}`);
      else value += char;
      continue;
    }
    if (char === "'" || char === '"') {
      quote = char;
      started = true;
    } else if (/\s/.test(char)) {
      if (started) {
        result.push(value);
        if (result.length > (options.maxArguments ?? 1024))
          throw new RangeError('Too many arguments');
        value = '';
        started = false;
      }
    } else if (';&|<>()'.includes(char) || char === '`' || char === '$')
      throw new TypeError(`Unsupported shell operator or expansion: ${char}`);
    else {
      value += char;
      started = true;
    }
  }
  if (quote) throw new TypeError('Unterminated quoted argument');
  if (started) result.push(value);
  if (result.length > (options.maxArguments ?? 1024)) throw new RangeError('Too many arguments');
  return result;
}
export function quotePosixArgument(argument: string): string {
  if (typeof argument !== 'string' || argument.includes('\0'))
    throw new TypeError('Argument must be a string without NUL');
  if (argument === '') return "''";
  if (/^[A-Za-z0-9_./:@%+=,-]+$/.test(argument)) return argument;
  return `'${argument.replaceAll("'", "'\\''")}'`;
}
export function quotePosixArguments(arguments_: readonly string[]): string {
  return arguments_.map(quotePosixArgument).join(' ');
}
