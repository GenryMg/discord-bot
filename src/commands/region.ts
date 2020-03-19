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
    if (!args[0]) return message.channel.createMessage(`Please provide a country name. (${countriesWithRegion.join(', ')})`);
    if (!args.slice(1).join(" ")) return message.channel.createMessage(`Please provide a region name.`)
    if (!countriesWithRegion.includes(args[0])) return message.channel.createMessage(`That country does not have any region data.`);
    const res = await require('node-fetch')(`https://coronavirus-tracker-api.herokuapp.com/v2/locations?country_code=${args[0].toLowerCase()}`);
    const data = await res.json();
    if (data.locations.length <= 0) return message.channel.createMessage(`That country was not found!`)
    const region = data.locations.find(c => c.province.toLowerCase().replace('\s?', '').includes(args.slice(1).join(" ")))
    if (!region) return message.channel.createMessage(`That region does not exist, or does not have the virus yet.`);
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
            name: 'Cases', value: region.latest.confirmed.toLocaleString(), inline: true
          },
          {
            name: 'Recovered', value: region.latest.recovered.toLocaleString(), inline: true
          },
          {
            name: 'Deaths', value: region.latest.deaths.toLocaleString(), inline: true
          },
        ]
      }
    })
  }
}
