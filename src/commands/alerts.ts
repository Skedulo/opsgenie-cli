import { InjectableClass, InjectProperty } from "@codecapers/fusion";
import { ICommand, ICommandDesc } from "../command";
import { IConfiguration_id, IConfiguration } from "../services/configuration";
import { ILog_id, ILog } from "../services/log";
import axios from "axios";
import chalk = require("chalk");
import { OutputStream } from "../lib/output-stream";

const pageSize = 100; // The max.

async function listAlerts(query: string, offset: number, domain: string, options: any): Promise<any[]> {
    try {
        const listResponse = await axios.get(`https://${domain}/v2/alerts?offset=${offset}&limit=${pageSize}&query=${query}`, options);
        return listResponse.data.data;
    }
    catch (err) {
        console.error(`Failed to get alerts:`);
        console.error(err && err.stack || err);
        return [];
    }
}
@InjectableClass()
export class AlertsCommand implements ICommand {

    @InjectProperty(IConfiguration_id)
    configuration!: IConfiguration;

    @InjectProperty(ILog_id)
    log!: ILog;

    async invoke(): Promise<void> {
        const apiKey = process.env.OPSGENIE_API_KEY;
        if (!apiKey) {
            throw new Error(`Please set environment variable OPSGENIE_API_KEY to your API key.`);
        }

        const query = this.configuration.getArg("query") || "status: open";

        const options = {
            headers: {
                "Authorization": `GenieKey ${apiKey}`,
            },
        };

        const outputStream = new OutputStream();
        outputStream.start();

        const maxAlerts = 20000;
        let offset = 0;

        const domain = this.configuration.getOpsGenieDomain();
        while (true) {
            const data = await listAlerts(query, offset, domain, options);
            if (data.length === 0) {
                break;
            }

            outputStream.add(data);
        
            offset += data.length;

            if (offset >= maxAlerts) {
                this.log.warn("Hit the maximum number of alerts that can be retreived from Opsgenie.");
                break;
            }
        }

        outputStream.end();
    }
}

const command: ICommandDesc = {
    name: "alerts",
    constructor: AlertsCommand,
    help: {
        usage: "opsgenie alerts [options]",
        description: "Prints open Opsgenie alerts to the terminal. By default it lists open alerts.",
        options: [
            {
                name: "--query", 
                description: `Search query to apply while filtering the alerts. Default: "status: open". Query syntax help: ${chalk.cyan("https://docs.opsgenie.com/v1.0/docs/alerts-search-query-help")}`,
            },
        ],
    },
};

export default command;