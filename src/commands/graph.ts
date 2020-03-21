import { Command } from "../struct/Command";
import { Message } from "eris";
import { CanvasRenderService } from 'chartjs-node-canvas';

export default class extends Command {
  constructor(client) {
    super(client, {
      name: 'graph',
      aliases: ['data', 'chart'],
      description: 'Get a chart with all data',
      cat: 'virus',
    });
  }
  async exec(message: Message, args: string[]) {
    const res = await require('node-fetch')(`https://corona.lmao.ninja/historical`);
    const data = await res.json();
    let found;
    if (!args[0]) return message.channel.createMessage('Please provide a country name');
    else found = data.find(c => c.country.toLowerCase().includes(args.join(" ").toLowerCase()))
    if (args[1]) found = data.find(c => c.country.toLowerCase().includes(args[0].toLowerCase()) && c.province.toLowerCase().includes(args.slice(1).join(" ").toLowerCase()))
    if (!found) return message.channel.createMessage('Nothing found.');
    const dataForChart = {
      cases: {
        dates: Object.keys(found.timeline.cases).map(c => new Date(c)),
        values: Object.values(found.timeline.cases)
      },
      deaths: {
        dates: Object.keys(found.timeline.deaths).map(c => new Date(c)),
        values: Object.values(found.timeline.deaths)
      },
      recovered: {
        dates: Object.keys(found.timeline.recovered).map(c => new Date(c)),
        values: Object.values(found.timeline.recovered)
      }
    }
    const canvasRenderService = new CanvasRenderService(800, 400, (ChartJS) => {
      ChartJS.plugins.register({
        beforeDraw: (chart) => {
          chart.ctx.fillStyle = "#121212";
          chart.ctx.fillRect(0, 0, chart.width, chart.height);
        }
      })
    });

    const mappedData = {
      cases: [],
      recovered: [],
      deaths: []
    };
    for (let i = 0; i < dataForChart.cases.dates.length; i++) {
      mappedData.cases.push({
        t: dataForChart.cases.dates[i],
        y: dataForChart.cases.values[i].toString()
      })
    }
    for (let i = 0; i < dataForChart.recovered.dates.length; i++) {
      mappedData.recovered.push({
        t: dataForChart.recovered.dates[i],
        y: dataForChart.recovered.values[i].toString()
      })
    }
    for (let i = 0; i < dataForChart.deaths.dates.length; i++) {
      mappedData.deaths.push({
        t: dataForChart.deaths.dates[i],
        y: dataForChart.deaths.values[i].toString()
      })
    }
    const colors = {
      cases: {
        backgroundColor: [],
        borderColor: []
      },
      recovered: {
        backgroundColor: [],
        borderColor: []
      },
      deaths: {
        backgroundColor: [],
        borderColor: []
      }
    }
    for (let i = 0; i < mappedData.cases.length; i++) {
      colors.cases.borderColor.push('rgba(181, 157, 0,1)')
      colors.cases.backgroundColor.push('rgba(181, 157, 0,0.1)')
    }
    for (let i = 0; i < mappedData.recovered.length; i++) {
      colors.recovered.borderColor.push('rgba(30, 227, 82,1)')
      colors.recovered.backgroundColor.push('rgba(30, 227, 82,0.3)')
    }
    for (let i = 0; i < mappedData.deaths.length; i++) {
      colors.deaths.borderColor.push('rgba(237, 24, 38,1)')
      colors.deaths.backgroundColor.push('rgba(237, 24, 38,0.4)')
    }
    const image = await canvasRenderService.renderToBuffer({
      type: 'line',
      data: {
        labels: dataForChart.cases.dates,
        datasets: [
          {
            label: 'Confirmed',
            data: mappedData.cases,
            backgroundColor: colors.cases.backgroundColor,
            borderColor: colors.cases.borderColor,
            borderWidth: 1
          },
          {
            label: 'Deaths',
            data: mappedData.deaths,
            backgroundColor: colors.deaths.backgroundColor,
            borderColor: colors.deaths.borderColor,
            borderWidth: 1
          },
          {
            label: 'Recovered',
            data: mappedData.recovered,
            backgroundColor: colors.recovered.backgroundColor,
            borderColor: colors.recovered.borderColor,
            borderWidth: 1
          }
        ]
      },
      options: {
        title: {
          display: true,
          text: `${found.province ? `${found.province}, ${found.country}` : `${found.country}`}`,
          fontColor: "white",
          fontSize: 22
        },
        legend: {
          labels: {
            fontColor: "white"
          }
        },
        scales: {
          xAxes: [{
            type: 'time',
            ticks: {
              fontColor: "white"
            }
          }],
          yAxes: [{
            ticks: {
              fontColor: "white"
            }
          }]
        }
      }
    });
    message.channel.createMessage({
      embed: {
        author: {
          name: `COVID-19 Chart`,
          icon_url: this.client.user.avatarURL
        },
        color: this.client.color,
        description: `Data for **${found.province ? `${found.province}, ${found.country}` : `${found.country}`}**`,
        image: {
          url: `attachment://${found.country}${found.province ? `-${found.province}` : ""}.png`
        },
        footer: {
          text: 'Having trouble? Join our support server: "cov support"'
        }
      }
    }, {
      name: `${found.country}${found.province ? `-${found.province}` : ""}.png`,
      file: image
    })
  }
}
