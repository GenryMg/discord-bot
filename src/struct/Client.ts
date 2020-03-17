import { GatewayClient, GatewayClientOptions } from '@arcanebot/redis-sharder';
import * as fs from 'fs';
import * as p from 'path';
import { Command } from '../struct/Command';
import * as DBL from 'dblapi.js';
import config = require('../../config.json')
import { Pool } from 'pg';

export class Client extends GatewayClient {
  public commands: Map<string, Command> = new Map();
  public aliases: Map<string, Command> = new Map();
  public color: number = 32896;
  public dbl: DBL;
  public pool: Pool;
  constructor(token: string, options: GatewayClientOptions) {
    super(token, options);
    this.token = token;
    this.readCommands();
    if (process.env.DEVELOPMENT !== 'true' || Number(process.env.pm_id) === 0) { this.dbl = new DBL(config.dbl.token, { webhookPort: config.dbl.port, webhookAuth: config.dbl.password }); }
  }

  async randomChance() {
    return Math.random() > .3;
  }

  async readCommands() {
    const files = this.readdir(process.env.DEVELOPMENT === 'true' ? './src/commands' : './out/src/commands');
    for (const file of files) {
      delete require.cache[require.resolve(`${process.cwd()}${p.sep}${file}`)];
      const command: Command = new ((await import(`${process.cwd()}${p.sep}${file}`)).default)(this);
      this.commands.set(command.name, command);
      for (const alias of command.aliases) {
        this.aliases.set(alias, command);
      }
    }
  }

  readdir(path: string) {
    var list = []
      , files = fs.readdirSync(path)
      , stats
      ;

    files.forEach(function (file) {
      stats = fs.lstatSync(p.join(path, file));
      if (stats.isDirectory()) {
        list = list.concat(this.readdir(p.join(path, file)));
      } else {
        list.push(p.join(path, file));
      }
    });

    return list;
  }
}