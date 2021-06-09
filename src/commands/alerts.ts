import { ILog, InjectableClass, InjectProperty } from "@codecapers/fusion";
import { IOpsgenieCommand, IOpsgenieCommandDesc as ICommandDesc } from "../lib/opsgenie-command";
import { IConfiguration_id, IConfiguration } from "../services/configuration";
import { IEnvironment, IEnvironment_id } from "../services/environment";
import { IFs, IFs_id } from "../services/fs";
import { IProgressIndicator, IProgressIndicator_id } from "../services/progress-indicator";
import { ILog_id } from "../services/log";
import axios from "axios";

const pageSize = 100; // The max.

async function listAlerts(query: string, offset: number, apiKey: string, options: any): Promise<any[]> {
    try {
        const listResponse = await axios.get(`https://api.opsgenie.com/v2/alerts?offset=${offset}&limit=${pageSize}&query=${query}`, options);
        return listResponse.data.data;
    }
    catch (err) {
        console.error(`Failed to get alerts:`);
        console.error(err && err.stack || err);
        return [];
    }
}
@InjectableClass()
export class AlertsCommand implements IOpsgenieCommand {

    @InjectProperty(IEnvironment_id)
    environment!: IEnvironment;

    @InjectProperty(IConfiguration_id)
    configuration!: IConfiguration;

    @InjectProperty(IFs_id)
    fs!: IFs;

    @InjectProperty(IProgressIndicator_id)
    progressIndicator!: IProgressIndicator;

    @InjectProperty(ILog_id)
    log!: ILog;

    async invoke(): Promise<void> {
        const apiKey = process.env.OPSGENIE_API_KEY;
        if (!apiKey) {
            throw new Error(`Please set environment variable OPSGENIE_API_KEY to your API key.`);
        }
        const query = "status: open";

        const options = {
            headers: {
                "Authorization": `GenieKey ${apiKey}`,
            },
        };

        const maxAlerts = 20000;
        let offset = 0;
        while (true) {
            const data = await listAlerts(query, offset, apiKey, options);
            if (data.length === 0) {
                break;
            }

            offset += data.length;

            for (const alert of data) {
                this.log.info(JSON.stringify(alert, null, 4));
            }
        
            if (offset >= maxAlerts) {
                this.log.info("Hit the maximum number of alerts that can be retreived from Opsgenie.");
                break;
            }
        }

    }
}

const command: ICommandDesc = {
    name: "alerts",
    description: "Retrieves opsgenie alerts.",
    constructor: AlertsCommand,
    help: {
        usage: "opsgenie alerts",
        message: "Prints open Opsgenie alerts to the terminal.",
        arguments: [],
    }
};

export default command;