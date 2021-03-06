import { Command } from "../struct/Command";
import { Message } from "eris";

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'countrylist',
      aliases: ['ls', 'cls', 'countryls'],
      description: 'Get all affected countries',
      cat: 'virus'
    });
  }
  async exec(message: Message, args: string[]) {
    const res = await require('node-fetch')(`https://corona.lmao.ninja/all`);
    const data = await res.json();

    message.channel.createMessage({
      content: Math.random() > .7 ? 'You can now **vote** for **COVID-19 Bot** here: <https://top.gg/bot/685268214435020809/vote> ' : '',
      embed: {
        author: {
          name: 'COVID-19 countries',
          icon_url: this.client.user.avatarURL
        },
        color: this.client.color,
        fields: [
          {
            name: 'List of affected countries', value: 'It can be found [here](https://www.worldometers.info/coronavirus/#countries)'
          }
        ],
        footer: {
          text: 'Having trouble? Join our support server: "cov support"'
        }
      }
    })
  }
}