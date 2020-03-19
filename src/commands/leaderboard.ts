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
        content: Math.random() > .7 ? 'You can now **vote** for **COVID-19 Bot** here: <https://top.gg/bot/685268214435020809/vote> ' : '',
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
      const countriesWithRegion = ['cn', 'ca', 'us', 'au']
      if (!countriesWithRegion.includes(args[0].toLowerCase())) return message.channel.createMessage(`That country does not have any region data.`);
      const res = await require('node-fetch')(`https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=${args[0].toLowerCase()}`);
      const data = await res.json();
      if (data.locations.length <= 0)
        data.locations.length = 10;
      const locations = data.locations.sort((a, b) => b.latest.confirmed - a.latest.confirmed);
      locations.length = 10;
      let i = 1;
      return message.channel.createMessage({
        content: Math.random() > .7 ? 'You can now **vote** for **COVID-19 Bot** here: <https://top.gg/bot/685268214435020809/vote> ' : '',
        embed: {
          author: {
            name: 'COVID-19 Top 10 Cases for ' + locations[0].country,
            icon_url: this.client.user.avatarURL
          },
          color: this.client.color,
          description: `${locations.map(c => `${i++}. **${c.province}:** ${c.latest.confirmed.toLocaleString()} cases`).join('\n')}`
        }
      })
    }
  }
}
