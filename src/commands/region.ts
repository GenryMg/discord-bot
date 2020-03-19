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
    const res = await require('node-fetch')(`https://coronavirus-stats.stantabcorp.co.uk`);
    const data = await res.json();

    if (!args[0]) return message.channel.createMessage(`Please provide a country name.`);
    if (!args.slice(1).join(" ")) return message.channel.createMessage(`Please provide a region name.`)
    const countriesWithRegion = ['china', 'canada', 'unitedstates', 'australia', 'cruiseship', 'ch', 'ca', 'us', 'au']
    if (!countriesWithRegion.includes(args[0])) return message.channel.createMessage(`That country does not have any region data.`);

    const country = data.sorted.find(c => c.country.name.toLowerCase().includes(args[0].toLowerCase()) || c.country.code.toLowerCase().includes(args[0].toLowerCase()))
    // console.log(country)
    if (!country) return message.channel.createMessage(`That country was not found!`)
    const region = country.regions.find(c => c.name.toLowerCase().replace('\s?', '').includes(args.slice(1).join(" ")))
    if (!region) return message.channel.createMessage(`That region does not exist, or does not have the virus yet.`);
    message.channel.createMessage({
      content: Math.random() > .7 ? 'You can now **vote** for **COVID-19 Bot** here: <https://top.gg/bot/685268214435020809/vote> ' : '',
      embed: {
        author: {
          name: `COVID-19 statistics for ${region.name}, ${country.country.name}`,
          icon_url: this.client.user.avatarURL
        },
        color: this.client.color,
        fields: [
          {
            name: 'Cases', value: region.statistics.confirmed.toLocaleString(), inline: true
          },
          {
            name: 'Recovered', value: region.statistics.recovered.toLocaleString(), inline: true
          },
          {
            name: 'Deaths', value: region.statistics.deaths.toLocaleString(), inline: true
          },
        ]
      }
    })
  }
}
