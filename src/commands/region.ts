import { Command } from "../struct/Command";
import { Message } from "eris";

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'region',
      aliases: ['r'],
      description: 'Get info on a region',
      cat: 'virus',
    });
  }
  async exec(message: Message, args: string[]) {
    const countriesWithRegion = ['cn', 'ca', 'us', 'au']
    const res = await require('node-fetch')(`https://corona.lmao.ninja/jhucsse`);
    const data = await res.json();
    if (!args[0]) return message.channel.createMessage(`Please provide a country name. (cn, ca, us, au)`);
    if (!countriesWithRegion.includes(args[0])) return message.channel.createMessage(`That is not a country with region data. (cn, ca, us, au)`);
    if (!args[1]) return message.channel.createMessage(`Please provide a region/province/state`)
    const region = data.find(c => c.country.toLowerCase() === args[0].toLowerCase() && c.province.toLowerCase().includes(args.slice(1).join(" ").toLowerCase()))

    message.channel.createMessage({
      content: Math.random() > .7 ? 'You can now **vote** for **COVID-19 Bot** here: <https://top.gg/bot/685268214435020809/vote> ' : '',
      embed: {
        author: {
          name: `COVID-19 statistics for ${region.province}, ${region.country}`,
          icon_url: this.client.user.avatarURL
        },
        color: this.client.color,
        fields: [
          {
            name: 'Cases', value: region.stats.confirmed.toLocaleString(), inline: true
          },
          {
            name: 'Recovered', value: region.stats.recovered.toLocaleString(), inline: true
          },
          {
            name: 'Deaths', value: region.stats.deaths.toLocaleString(), inline: true
          },
        ],
        footer: {
          text: 'Having trouble? Join our support server: "cov support"'
        }
      }
    })
  }
}
