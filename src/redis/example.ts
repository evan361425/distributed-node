import { readFileSync } from 'fs';
import IORedis, { Redis } from 'ioredis';

const redis = new IORedis('localhost:6379') as Redis & {
  addUser: (
    lobbyTable: string,
    gameTable: string,
    playerName: string,
  ) => AddUserResponse;
};

redis.defineCommand('addUser', {
  numberOfKeys: 2,
  lua: readFileSync(__dirname + '/add-user.lua').toString(),
});

const LOBBY = 'lobby';
const GAME = 'game';

void (async () => {
  const result = await Promise.all([
    redis.addUser(LOBBY, GAME, 'alice'),
    redis.addUser(LOBBY, GAME, 'bob'),
    redis.addUser(LOBBY, GAME, 'cindy'),
    redis.addUser(LOBBY, GAME, 'evan.lu'),
  ]);

  const actions = result.map((val, index) => {
    if (Array.isArray(val)) {
      return createdGame(val[0], val[1]);
    } else {
      console.log(`Index: ${index}, user: ${val}`);
      return Promise.resolve();
    }
  });

  await Promise.all(actions);
})();

async function createdGame(gid: string, players: string): Promise<void> {
  console.log('GAME ID', gid, 'PLAYERS', players.split(','));
  await redis.quit();
}

type AddUserResponse = string | [string, string];
