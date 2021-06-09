import { ILog, InjectableClass, InjectProperty } from "@codecapers/fusion";
import { IOpsgenieCommand, IOpsgenieCommandDesc as ICommandDesc } from "../lib/opsgenie-command";
import { joinPath } from "../lib/join-path";
import { IConfiguration_id, IConfiguration } from "../services/configuration";
import { IEnvironment, IEnvironment_id } from "../services/environment";
import { IFs, IFs_id } from "../services/fs";
import { IProgressIndicator, IProgressIndicator_id } from "../services/progress-indicator";
import { ILog_id } from "../services/log";

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
        console.log("alerts"); //fio:

    }
}

const command: ICommandDesc = {
    name: "alerts",
    description: "Retrieves opsgenie alerts.",
    constructor: AlertsCommand,
    help: {
        usage: "opsgenie alerts",
        message: "Downloads opsgenie alerts to alerts.csv.",
        arguments: [],
    }
};

export default command;