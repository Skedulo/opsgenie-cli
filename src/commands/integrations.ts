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

        const options = {
            headers: {
                "Authorization": `GenieKey ${apiKey}`,
            },
        };

        const subCommand = this.configuration.getMainCommand();
        if (subCommand === undefined) {
            const integrations = await this.listIntegrations(options);
    
            const outputStream = new OutputStream();
            outputStream.start();
            outputStream.add(integrations);
            outputStream.end();
        }
        else if (subCommand === "enable") {
            const integrationId = this.configuration.getArg("id");
            const integrationName = this.configuration.getArg("name");
            if (!integrationId && !integrationName) {
                throw new Error(`Please specify the integration using --id=<integration-id> or --name=<integration-name>. Integration name can contain wildcards using the * character.`);
            }

            if (integrationId) {
                await axios.post(`https://api.opsgenie.com/v2/integrations/${integrationId}/enable`, {}, options);
                this.log.info("Enabled integration.");
            }
            else {
                const integrations = await this.matchIntegrations(integrationName!, options);
                for (const integration of integrations) {
                    await axios.post(`https://api.opsgenie.com/v2/integrations/${integration.id}/enable`, {}, options);                   
                }
                this.log.info(`Enabled ${integrations.length} integrations.`);
            }
        }
        else if (subCommand === "disable") {
            const integrationId = this.configuration.getArg("id");
            const integrationName = this.configuration.getArg("name");
            if (!integrationId && !integrationName) {
                throw new Error(`Please specify the integration using --id=<integration-id> or --name=<integration-name>. Integration name can contain wildcards using the * character.`);
            }

            if (integrationId) {
                await axios.post(`https://api.opsgenie.com/v2/integrations/${integrationId}/disable`, {}, options);
                this.log.info("Disabled integration.");
            }
            else {
                const integrations = await this.matchIntegrations(integrationName!, options);
                for (const integration of integrations) {
                    await axios.post(`https://api.opsgenie.com/v2/integrations/${integration.id}/disable`, {}, options);                   
                }
                this.log.info(`Disabled ${integrations.length} integrations.`);
            }
        }
        else {
            throw new Error(`"${subCommand}" is an unexpected sub command for command "integrations"`);
        }       

    }

    //
    // Gets the list of all integrations.
    //
    private async listIntegrations(options: any): Promise<any[]> {
        const listResponse = await axios.get(`https://api.opsgenie.com/v2/integrations`, options);
        const integrations = listResponse.data.data;
        return integrations;
    }

    //
    // Match integrations by name.
    //
    private async matchIntegrations(name: string, options: any): Promise<any[]> {
        const integrations = await this.listIntegrations(options);
        return integrations.filter(integration => {
            return integration.name.toLowerCase() === name.toLowerCase();
        });
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