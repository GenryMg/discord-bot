import { Command } from "../struct/Command";
import { Message } from "eris";

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'support',
      aliases: [],
      description: 'Join the official support server',
      cat: 'system'
    });
  }
  async exec(message: Message, args: string[]) {
    message.channel.createMessage({
      embed: {
        author: {
          name: 'COVID-19 support',
          icon_url: this.client.user.avatarURL
        },
        color: this.client.color,
        fields: [
          {
            name: 'Discord Server', value: 'It\'s [Here](https://discord.gg/EvbMshU)'
          }
        ]
      }
    })
  }
}