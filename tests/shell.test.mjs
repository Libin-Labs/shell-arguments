import test from 'node:test';
import assert from 'node:assert/strict';
import { parseShellArguments, quotePosixArgument, quotePosixArguments } from '../dist/esm/index.js';
test('parses whitespace and empty quoted arguments', () => {
  assert.deepEqual(parseShellArguments(`a '' "b c"`), ['a', '', 'b c']);
});
test('parses quoted apostrophe with POSIX quote helper round trip', () => {
  const values = ['a', "it's", '', 'two words'];
  assert.deepEqual(parseShellArguments(quotePosixArguments(values)), values);
});
test('backslash escapes a character outside single quotes', () => {
  assert.deepEqual(parseShellArguments(String.raw`a\ b`), ['a b']);
});
test('single quotes preserve backslashes literally', () => {
  assert.deepEqual(parseShellArguments(String.raw`'a\b'`), [String.raw`a\b`]);
});
test('rejects command operators and expansions', () => {
  for (const input of ['a;id', '$(whoami)', 'x|y', '`date`', '"$HOME"'])
    assert.throws(() => parseShellArguments(input));
});
test('rejects unmatched quotes and terminal escapes', () => {
  assert.throws(() => parseShellArguments("'oops"));
  assert.throws(() => parseShellArguments('a\\'));
});
test('applies input and argument budgets', () => {
  assert.throws(() => parseShellArguments('a b', { maxArguments: 1 }), RangeError);
});
test('rejects NUL during quoting', () => {
  assert.throws(() => quotePosixArgument('a\0b'));
});
