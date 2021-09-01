import { Console } from 'console';
import { Transform } from 'stream';

export default function createLogger(verbose = false): Console {
  const verboseSream = new Transform({
    transform(chunk, _, next) {
      if (verbose) this.push(chunk);
      next();
    },
  });

  verboseSream.pipe(process.stdout);
  const console = new Console(verboseSream);

  global.console = console;

  return console;
}
