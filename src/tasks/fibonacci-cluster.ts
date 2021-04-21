import cluster from 'cluster';

console.log(`master pid=${process.pid}`);
cluster.setupMaster({ exec: __dirname + '/fibonacci-async-vs-sync.ts' });

// fork two cluster
cluster.fork();
cluster.fork();

cluster
  .on('disconnect', (worker) => {
    console.log('disconnect', worker.id);
  })
  .on('exit', (worker, code, signal) => {
    console.log('exit', worker.id, code, signal);
  })
  .on('listening', (worker, { address, port }) => {
    console.log('listening', worker.id, `${address}:${port}`);
  });
