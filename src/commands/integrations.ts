import { InjectableClass, InjectProperty } from "@codecapers/fusion";
import { IOpsgenieCommand, IOpsgenieCommandDesc } from "../lib/opsgenie-command";
import { IConfiguration_id, IConfiguration } from "../services/configuration";
import { ILog_id, ILog } from "../services/log";
import axios from "axios";
import chalk = require("chalk");
import { OutputStream } from "../lib/output-stream";

@InjectableClass()
export class IntegrationsCommand implements IOpsgenieCommand {

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

        const listResponse = await axios.get(`https://api.opsgenie.com/v2/integrations`, options);
        const integrations = listResponse.data.data;

        const outputStream = new OutputStream();
        outputStream.start();
        outputStream.add(integrations);
        outputStream.end();
    }
}

const command: IOpsgenieCommandDesc = {
    name: "integrations",
    description: "Retrieves opsgenie integrations.",
    constructor: IntegrationsCommand,
    help: {
        usage: "opsgenie integrations",
        message: "Prints open Opsgenie integrations to the terminal.",
        arguments: [
        ],
    }
};

export default command;