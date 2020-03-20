import { Command } from "../struct/Command";
import { Message } from "eris";
import { inspect } from "util";
import fetch from 'node-fetch';

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'eval',
      description: 'Get all evals idk',
      aliases: ['ev', 'evaluate'],
      cat: 'owner',
      owner: true
    });
  }
  async exec(message: Message, args: string[]) {
    let input = args.join(" ");
    if (input.startsWith('\`\`\`js') || input.startsWith('\`\`\`') && input.endsWith('\`\`\`')) {
      input = input.replace(/`/gi, '')
        .replace(/js/gi, '');
    }
    try {
      let evaled;
      // if (args.async) {
      //   evaled = await eval(`(async() => { ${input} })()`)
      // } else {
      evaled = await eval(input);
      // }
      let evaluation = inspect(evaled, { depth: 0 });
      let dataType = Array.isArray(evaled) ? "Array<" : typeof evaled, dataTypes: string[] | string[] = [];
      if (~dataType.indexOf("<")) {
        // @ts-ignore
        evaled.forEach(d => {
          if (~dataTypes.indexOf(Array.isArray(d) ? "Array" : typeof d)) return;
          dataTypes.push(Array.isArray(d) ? "Array" : typeof d);
        });
        dataType += dataTypes.map(s => s[0].toUpperCase() + s.slice(1)).join(", ") + ">";
      }
      if (evaluation.length >= 1000) {
        const res = await fetch(`https://bin.lunasrv.com/documents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'text/plain'
          },
          body: evaluation
        });
        const json = await res.json();
        console.log(json)
        return message.channel.createMessage(`**Done:** https://bin.lunasrv.com/${json.key}`);
      }
      return message.channel.createMessage(`**Done:** \`\`\`js\n${evaluation}\`\`\`\n`);
    } catch (e) {
      const regex = /\[\d+m/gmi;
      return message.channel.createMessage(`**Error:** \`\`\`diff\n- ${e.message.replace(regex, '')}\`\`\``);
    }
  }
}