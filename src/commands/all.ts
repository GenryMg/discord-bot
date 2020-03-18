import { Command } from "../struct/Command";
import { Message } from "eris";

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'all',
      aliases: ['coronavirus', 'covid19', 'ncov', 'corona', 'virus'],
      description: 'Get all info COVID-19',
      cat: 'virus'
    });
  }
  async exec(message: Message, args: string[]) {
    const res = await require('node-fetch')(`https://corona.lmao.ninja/countries`);
    const data = await res.json();

    const cases = data.map(d => d.cases).reduce((a, b) => a + b);
    // console.log(data.reduce((a, b) => a + b));
    const casesToday = data.map(d => d.todayCases).reduce((a, b) => a + b);
    const deaths = data.map(d => d.deaths).reduce((a, b) => a + b);
    const deathsToday = data.map(d => d.todayDeaths).reduce((a, b) => a + b);
    const recovered = data.map(d => d.recovered).reduce((a, b) => a + b);
    const critical = data.map(d => d.critical).reduce((a, b) => a + b);

    message.channel.createMessage({
      content: Math.random() > .7 ? 'You can now **vote** for **COVID-19 Bot** here: <https://top.gg/bot/685268214435020809/vote>, feel free to join our server also: <https://discord.gg/EvbMshU>' : '',
      embed: {
        author: {
          name: 'COVID-19',
          icon_url: this.client.user.avatarURL
        },
        color: this.client.color,
        fields: [
          {
            name: 'Cases', value: cases.toLocaleString(), inline: true
          },
          {
            name: 'Deaths', value: deaths.toLocaleString(), inline: true
          },
          {
            name: 'Recovered', value: recovered.toLocaleString(), inline: true
          },
          {
            name: 'Critical Condition', value: critical.toLocaleString(), inline: true
          },
          {
            name: 'Cases Today', value: casesToday.toLocaleString(), inline: true
          },
          {
            name: 'Deaths Today', value: deathsToday.toLocaleString(), inline: true
          },
        ]
      }
    })
  }
}