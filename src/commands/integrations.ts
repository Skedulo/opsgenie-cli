import { InjectableClass, InjectProperty } from "@codecapers/fusion";
import { ICommand, ICommandDesc } from "../command";
import { IConfiguration_id, IConfiguration } from "../services/configuration";
import { ILog_id, ILog } from "../services/log";
import axios from "axios";
import { OutputStream } from "../lib/output-stream";
import integrationsEnableCommand from "./integrations/enable";
import integrationsDisableCommand from "./integrations/disable";

@InjectableClass()
export class IntegrationsCommand implements ICommand {

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

        const integrationRegex = this.configuration.getArg("reg");
        let integrations = integrationRegex !== undefined
            ? await this.matchRegex(new RegExp(integrationRegex), options)
            : await this.listIntegrations(options);

        const outputStream = new OutputStream();
        outputStream.start();
        outputStream.add(integrations);
        outputStream.end();
    }

    //
    // Apply an action against integration(s).
    //
    private async actionIntegrations(apiOperation: string, options: any, action: string) {
        const integrationId = this.configuration.getArg("id");
        const integrationName = this.configuration.getArg("name");
        const integrationRegex = this.configuration.getArg("reg");
        const domain = this.configuration.getOpsGenieDomain();

        if (!integrationId && !integrationName && !integrationRegex) {
            throw new Error(`Please specify integration(s) using --id=<integration-id>, --name=<integration-name> or --reg=<name-regex>.`);
        }

        const dryRun = this.configuration.getArg<boolean>("dry-run") || false;

        let integrations: any[];

        if (integrationId) {
            integrations = [{ id: integrationId }];
        }
        else if (integrationName) {
            integrations = await this.matchIntegrations(integrationName, options);
        }
        else {
            integrations = await this.matchRegex(new RegExp(integrationRegex!), options);
        }

        if (dryRun) {
            this.log.info(`Would ${apiOperation} ${integrations.length} integrations:`);

            for (const integration of integrations) {
                this.log.info(`  ${integration.name}`)
            }
        }
        else {
            for (const integration of integrations) {
                await axios.post(`https://${domain}/v2/integrations/${integration.id}/${apiOperation}`, {}, options);
            }
        }

        this.log.info(`${action} ${integrations.length} integrations.`);
    }

    //
    // Gets the list of all integrations.
    //
    private async listIntegrations(options: any): Promise<any[]> {
        const domain = this.configuration.getOpsGenieDomain();

        const listResponse = await axios.get(`https://${domain}/v2/integrations`, options);
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

    //
    // Match integrations by regex.
    //
    private async matchRegex(nameRegex: RegExp, options: any): Promise<any[]> {
        const integrations = await this.listIntegrations(options);
        return integrations.filter(integration => {
            return nameRegex.test(integration.name);
        });
    }
}

const command: ICommandDesc = {
    name: "integrations",
    constructor: IntegrationsCommand,
    subCommands: [
        integrationsEnableCommand,
        integrationsDisableCommand,
    ],
    help: {
        usage: "opsgenie integrations [<command>]",
        description: "Prints open Opsgenie integrations to the terminal. By default this command lists integrations.",
    },
};

export default command;