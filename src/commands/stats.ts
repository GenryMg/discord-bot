import { Command } from "../struct/Command";
import { Message, TextChannel } from "eris";
import { ShardStats, Stats } from "@arcanebot/redis-sharder";

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'stats',
      aliases: ['botinfo', 'bi'],
      description: 'Bot statistics'
    });
  }
  async exec(message: Message, args: string[]) {
    //@ts-ignore
    const commandsUsed = await this.client.redisConnection.get(`${this.client.lockKey}:commands`)
    //@ts-ignore
    const stats: Stats = await this.client.getStats();
    if (!args[0]) return message.channel.createMessage({
      embed: {
        author: {
          name: 'COVID-19 Bot Statistics',
          icon_url: this.client.user.avatarURL
        },
        color: this.client.color,
        description: `**Memory:** ${(stats.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}/**8 GB**`,
        fields: [
          {
            name: 'Guilds', value: stats.guilds.toLocaleString(), inline: true
          },
          {
            name: 'Users', value: stats.users.toLocaleString(), inline: true
          },
          {
            name: 'Shard', value: ((message.channel as TextChannel).guild.shard.id + 1) + '/' + this.client.shards.size, inline: true
          },
          {
            name: 'Commands Used', value: `${commandsUsed.toLocaleString()}`, inline: true
          },
          {
            name: 'Uptime', value: `${require('ms')(this.client.uptime)}`, inline: true
          }
        ]
      }
    });
    if (args[0].toLowerCase() === 'shards' || args[0].toLowerCase() === 's') return message.channel.createMessage({
      embed: {
        author: {
          name: 'COVID-19 Shards',
          icon_url: this.client.user.avatarURL
        },
        description: `**Memory:** ${(stats.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}/**8 GB**`,
        color: this.client.color,
        fields: stats.shards.sort((a, b) => a.id - b.id).map(c => { return { name: `Shard ${c.id}`, value: `**Status:** ${c.status}\n**Latency:** ${c.latency} ms\n**Guilds:** ${c.guilds.toLocaleString()}`, inline: true } })
      }
    });
    if (args[0].toLowerCase() === 'clusters' || args[0].toLowerCase() === 'c') return message.channel.createMessage({
      embed: {
        author: {
          name: 'COVID-19 Clusters',
          icon_url: this.client.user.avatarURL
        },
        description: `**Memory:** ${(stats.memoryUsage.heapUsed / 1024 / 1024).toFixed(2)}/**8 GB**`,
        color: this.client.color,
        fields: stats.clusters.sort((a, b) => a.id - b.id).map(c => { return { name: `Cluster ${c.id}`, value: `**Guilds:** ${c.guilds}\n**Users:** ${c.users}\n**Shards:** ${c.shards.join(", ").toString()}`, inline: true } })
      }
    });
  }
}