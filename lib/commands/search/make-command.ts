import { Command } from 'commander';
import { Action } from 'commands';

export function makeCLI(): Command {
  const program = new Command('search');

  program
    .description(
      'Search for movies and TV Shows by keyword, searching for the best match'
    )
    .argument('<keyword...>', 'keyword to search for')
    .option('-v, --verbose')
    .alias('query');

  return program;
}

export function makeCommand(action: Action): Command {
  const program = makeCLI();
  program.action(action);

  return program;
}
