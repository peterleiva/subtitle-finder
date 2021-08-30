import { makeCommand } from './make-command';
import query from './query';

const program = makeCommand(query);

program.parse(process.argv);
