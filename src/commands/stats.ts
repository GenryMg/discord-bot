import { Command } from "../struct/Command";
import { Message, TextChannel } from "eris";
import { ShardStats, Stats } from "@arcanebot/redis-sharder";
import * as os from 'os';

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
        fields: [
          {
            name: 'Client', value: `
**Guilds:** ${stats.guilds.toLocaleString()} (**This Cluster:** ${this.client.guilds.size.toLocaleString()})
**Users:** ${stats.users.toLocaleString()} (**This Cluster:** ${this.client.users.size.toLocaleString()})
**Shard:** ${(message.channel as TextChannel).guild.shard.id + 1}/${stats.shards.length}
**Cluster:** ${stats.clusters.find(c => c.shards.includes((message.channel as TextChannel).guild.shard.id)).id + 1}/${stats.clusters.length}
**Uptime:** ${require('ms')(this.client.uptime)}
`, inline: true
          },
          {
            name: 'System', value: `
**RAM Usage:** \`${Math.round(os.freemem() / 1024 / 1024)}/${Math.round(os.totalmem() / 1024 / 1024)} MB\`
**Client Usage:** \`${Math.round(stats.memoryUsage.heapUsed / 1024 / 1024)}/${Math.round(os.totalmem() / 1024 / 1024)} MB\`
`
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
        color: this.client.color,
        fields: stats.shards.sort((a, b) => a.id - b.id).map(c => { return { name: `Shard ${c.id}`, value: `**Status:** ${c.status}\n**Latency:** ${c.latency ? c.latency : '0'} ms\n**Guilds:** ${c.guilds.toLocaleString()}`, inline: true } })
      }
    });
    if (args[0].toLowerCase() === 'clusters' || args[0].toLowerCase() === 'c') return message.channel.createMessage({
      embed: {
        author: {
          name: 'COVID-19 Clusters',
          icon_url: this.client.user.avatarURL
        },
        color: this.client.color,
        fields: stats.clusters.sort((a, b) => a.id - b.id).map(c => { return { name: `Cluster ${c.id}`, value: `**Guilds:** ${c.guilds}\n**Users:** ${c.users}\n**Shards:** ${c.shards.join(", ").toString()}\n**RAM:** \`${Math.round(c.memoryUsage.heapUsed / 1024 / 1024)}/${Math.round(os.totalmem() / 1024 / 1024)} MB\``, inline: true } })
      }
    });
  }
}