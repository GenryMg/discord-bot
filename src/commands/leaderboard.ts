import { Command } from "../struct/Command";
import { Message } from "eris";

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      aliases: ['lb', 'top'],
      description: 'Leaderboard of cases',
      cat: 'virus'
    });
  }
  async exec(message: Message, args: string[]) {
    if (!args[0]) {
      const res = await require('node-fetch')(`https://corona.lmao.ninja/countries`);
      const data = await res.json();
      data.length = 10;
      let i = 1;
      return message.channel.createMessage({
        content: Math.random() > .2 ? 'You can now **vote** for **COVID-19 Bot** here: <https://top.gg/bot/685268214435020809/vote>, feel free to join our server also: <https://discord.gg/EvbMshU>' : '',
        embed: {
          author: {
            name: 'COVID-19 Top 10 Cases',
            icon_url: this.client.user.avatarURL
          },
          color: this.client.color,
          description: `${data.map(c => `${i++}. **${c.country}:** ${c.cases.toLocaleString()} cases`).join('\n')}`
        }
      })
    } else {
      const res = await require('node-fetch')(`https://coronavirus-stats.stantabcorp.co.uk`);
      const data = await res.json();
      const countriesWithRegion = ['china', 'canada', 'unitedstates', 'australia', 'cruiseship', 'ch', 'ca', 'us', 'au']
      if (!countriesWithRegion.includes(args[0])) return message.channel.createMessage(`That country does not have any region data.`);

      const country = data.sorted.find(c => c.country.name.toLowerCase() === args[0].toLowerCase() || c.country.code.toLowerCase() === args[0].toLowerCase())
      country.regions.length = 10;
      let i = 1;
      return message.channel.createMessage({
        content: Math.random() > .2 ? 'You can now **vote** for **COVID-19 Bot** here: <https://top.gg/bot/685268214435020809/vote>, feel free to join our server also: <https://discord.gg/EvbMshU>' : '',
        embed: {
          author: {
            name: 'COVID-19 Top 10 Cases for ' + country.country.name,
            icon_url: this.client.user.avatarURL
          },
          color: this.client.color,
          description: `${country.regions.map(c => `${i++}. **${c.name}:** ${c.statistics.confirmed.toLocaleString()} cases`).join('\n')}`
        }
      })
    }
  }
}
