import { Command } from 'commander';
import { version } from '../package.json';

const program = new Command('subtitle-finder');

program
  .version(version)
  .description(
    'Search and download subtitles in most popular providers. The search can be made with a keyword or using a video file'
  );

program
  .option('-y, --yes', 'download without asking')
  .option(
    '-o, --output <path>',
    'Write output to <path> instead of current directory path'
  );

program
  .command(
    'search <keyword>',
    'Search for movies and TV Shows by keyword, searching for the best match',
    { executableFile: __dirname + '/commands/search.js' }
  )
  .alias('query')
  .command(
    'scan <dir>',
    'Scan a directory, searching for subtitles for all video files found'
  );

program.parse(process.argv);

export { program };
