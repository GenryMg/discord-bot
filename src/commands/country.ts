import { Command } from "../struct/Command";
import { Message } from "eris";

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'country',
      aliases: ['c'],
      description: 'Get all info COVID-19',
      cat: 'virus'
    });
  }
  async exec(message: Message, args: string[]) {
    const res = await require('node-fetch')(`https://corona.lmao.ninja/countries`);
    const data = await res.json();

    if (!args[0]) return message.channel.createMessage(`Please provide a country name.`);
    const country = data.find(c => c.country.toLowerCase().includes(args.join(" ").toLowerCase()));
    if (!country) return message.channel.createMessage(`That country does not exist, or does not have the virus yet.`);

    message.channel.createMessage({
      content: Math.random() > .2 ? 'You can now **vote** for **COVID-19 Bot** here: <https://top.gg/bot/685268214435020809/vote>, feel free to join our server also: <https://discord.gg/EvbMshU>' : '',
      embed: {
        author: {
          name: 'COVID-19 statistics for ' + country.country,
          icon_url: this.client.user.avatarURL
        },
        color: this.client.color,
        fields: [
          {
            name: 'Cases', value: country.cases.toLocaleString(), inline: true
          },
          {
            name: 'Recovered', value: country.recovered.toLocaleString(), inline: true
          },
          {
            name: 'Deaths', value: country.deaths.toLocaleString(), inline: true
          },
          {
            name: 'Cases Today', value: country.todayCases.toLocaleString(), inline: true
          },
          {
            name: 'Deaths Today', value: country.todayDeaths.toLocaleString(), inline: true
          },
        ]
      }
    })
  }
}
