//
// The Opsgenie-cli application.
//

import { ILog, InjectableClass, InjectProperty } from "@codecapers/fusion";
import { IEnvironment, IEnvironment_id } from "./services/environment";
import { ILog_id } from "./services/log";
import { IConfiguration, IConfiguration_id } from "./services/configuration";
import { ICommand, ICommandDesc, ICommandHelp } from "./command";
const packageInfo = require("../package.json");

import { commands } from "./commands";
import chalk = require("chalk");
import command from "./commands/alerts";

//
// Find a command or sub-command by name.
//
function findCommand(parentCommand: ICommandDesc | undefined, commandName: string): ICommandDesc {
    let searchCommands: ICommandDesc[];
    if (parentCommand) {
        if (!parentCommand.subCommands) {
            throw new Error(`Failed to find command ${commandName}, the parent command ${parentCommand.name} has no sub-commands!`);
        }
        searchCommands = parentCommand.subCommands;
    }
    else {
        searchCommands = commands;
    }

    for (const command of searchCommands) {
        if (command.name === commandName) {
            return command;
        }
    }

    if (parentCommand) {
        throw new Error(`Failed to find command ${commandName} under command ${parentCommand.name}`);
    }
    else {
        throw new Error(`Failed to find command ${commandName}`);
    }
}

@InjectableClass()
export class Api {
    
    @InjectProperty(ILog_id)
    log!: ILog;

    @InjectProperty(IEnvironment_id)
    environment!: IEnvironment;

    @InjectProperty(IConfiguration_id)
    configuration!: IConfiguration;

    async invoke(): Promise<void> {
        
        const showInfo = this.configuration.getArg<boolean>("info") || this.configuration.isDebug();
        if (showInfo) {
            this.configuration.info();
            this.environment.info();
        }

        if (this.configuration.getArg<boolean>("version")) {
            this.log.info(`Opsgenie-cli v${packageInfo.version}`);
            return;
        }

        let commandDesc: ICommandDesc | undefined = undefined;
        while (true) {
            const commandName = this.configuration.getMainCommand();
            if (commandName === undefined) {
                break;
            }

            commandDesc = findCommand(commandDesc, commandName);
            this.configuration.consumeMainCommand();
        }

        const help = this.configuration.getArg<boolean>("help");
        if (help) {
            if (commandDesc === undefined) {
                this.showGeneralHelp();
                return;
            }
            else {
                this.showCommandHelp(commandDesc);
                return;
            }
        }

        if (commandDesc === undefined) {
            this.showGeneralHelp();
            return;
        }

        const Command: any = commandDesc.constructor;
        const command: ICommand = new Command();
        await command.invoke();
    }

    //
    // Shows general help.
    //
    private showGeneralHelp(): void {
        this.showHelp({
            usage: `opsgenie <command> [options]`,
            message: `Command line interface to Opsgenie.`,
            arguments: [
                [ "--version", "Displays the current version number." ],
                [ "--non-interactive", "Runs in non-interactive mode." ],
                [ "--verbose", "Enables versbose logging." ],
                [ "--quiet", "Tuns in quiet mode, supresses logging unless absolutely necessary." ],
                [ "--debug", "Enables debug logging." ],
            ],
        })
    }

    //
    // Shows help for a sub-command.
    //
    private showCommandHelp(command: ICommandDesc): void {
        this.showHelp(command.help);
    }

    //
    // Formats help described in the "help" object.
    //
    private showHelp(help: ICommandHelp): void {
        this.log.info(`\nUsage: ${chalk.blueBright(help.usage)}\n`);
        this.log.info(`${help.message}\n`);

        this.log.info(`Options:`);

        const padding = " ".repeat(4);
        const optionsPadding = 25;

        for (const [argName, argDesc] of help.arguments) {
            this.log.info(`${padding}${argName!.padEnd(optionsPadding)}${argDesc}`)
        }
    }
}