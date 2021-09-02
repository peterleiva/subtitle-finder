import { Command } from 'commander';
import { Action } from 'commands';

export function makeCLI(): Command {
  const program = new Command('search');

  program
    .description(
      'Search for movies and TV Shows by keyword, searching for the best match'
    )
    .option(
      '-v, --verbose',
      'Make subtitle-finder to verbose during operation. Useful for debugging and see what\'s going on "under the hood"'
    )
    .argument('<keyword...>', 'keyword to search for')
    .alias('query');

  return program;
}

export function makeCommand(action: Action): Command {
  const program = makeCLI();
  program.action(action);

  return program;
}
