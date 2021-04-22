/**
 * commands:
 * 1. npx ts-node src/recipe-api/producer-cluster.ts
 * 2.
 *   1. curl http://localhost:4000/recipes/42
 *   2. curl http://localhost:4000/recipes/42
 *   3. curl http://localhost:4000/recipes/42
 * 3. kill <PID worker 1>
 * 4.
 *   1. curl http://localhost:4000/recipes/42
 *   2. curl http://localhost:4000/recipes/42
 * 5. kill <PID worker 2>
 */
import cluster from 'cluster';

console.log(`master pid=${process.pid}`);
cluster.setupMaster({ exec: __dirname + '/producer-http-basic.ts' });

// fork two cluster
cluster.fork();
cluster.fork();

cluster
  .on('disconnect', (worker) => {
    console.log('disconnect', worker.id);
  })
  .on('exit', (worker, code, signal) => {
    console.log('exit', worker.id, code, signal);
    // cluster.fork();
  })
  .on('listening', (worker, { address, port }) => {
    console.log('listening', worker.id, `${address}:${port}`);
  });
