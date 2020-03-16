import './console';

import { Client } from "./struct/Client";
import { Message } from "eris";
import config = require('../config.json');
import Logger from "@ayanaware/logger";
import { Stats } from '@arcanebot/redis-sharder';

const client = new Client(process.env.DEVELOPMENT === 'true' ? config.tokens.dev : config.tokens.prod, {
  erisOptions: {
    disableEveryone: true,
    maxShards: 4
  },
  lockKey: process.env.DEVELOPMENT === 'true' ? config.lock_keys.dev : config.lock_keys.prod,
  redisHost: config.redis.host,
  shardsPerCluster: 2,
  //@ts-ignore
  getFirstShard: () => {
    return Number(process.env.pm_id);
  },
});

client.queue();

client.on('shardReady', (id: number) => {
  Logger.get(Client).info(`Shard: ${id} with status 'ready'`);
  client.shards.get(id).editStatus("dnd", {
    name: `https://corona.lmao.ninja/invite (${id + 1}/${client.options.maxShards})`
  })
  if (process.env.DEVELOPMENT !== 'true') {
    client.getStats().then((stats: Stats) => {
      client.dbl.postStats(stats.guilds, 0, client.options.maxShards)
    });
  }
});

client.on('shardDisconnect', (err: Error, id: number) => {
  Logger.get(Client).info(`Shard: ${id} with status 'disconnected' because ${err.message}`);
  process.exit(0)
})

client.on('acquiredLock', () => {
  Logger.get('Lock').info(`Aquired lock for cluster ${process.env.pm_id}`)
});

client.on('messageCreate', async (message: Message) => {
  if (message.author.bot) return;
  const prefix = process.env.DEVELOPMENT === 'true' ? '...' : 'COV ';
  if (!message.content.toLowerCase().startsWith(prefix.toLowerCase())) return;
  const args = message.content.trim().slice(prefix.length).split(/\s+/g);
  const command = args.shift().toLowerCase();
  const cmd = client.commands.get(command) || client.aliases.get(command);
  if (!cmd) return;
  if (cmd.owner && !config.devs.includes(message.author.id)) return;
  try {
    client.redisConnection.incr(`${client.lockKey}:commands`);
    return await cmd.exec(message, args);
  } catch (e) {
    console.error(e);
    return;
  }
})

if (process.env.DEVELOPMENT !== 'true') {
  setInterval(() => {
    client.getStats().then((stats: Stats) => {
      client.dbl.postStats(stats.guilds, 0, client.options.maxShards)
    });
  }, 1800000);
}