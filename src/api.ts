//
// The Opsgenie-cli application.
//

import { ILog, InjectableClass, InjectProperty } from "@codecapers/fusion";
import { IEnvironment, IEnvironment_id } from "./services/environment";
import { ILog_id } from "./services/log";
import { IConfiguration, IConfiguration_id } from "./services/configuration";
import { ICommand, ICommandDesc, ICommandHelp, IOptionHelp } from "./command";
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

    private globalOptions = [
        {
            name: "--help",
            description: "Shows help for opsgenie and sub-commands.",
        },
        {
            name: "--version",
            description: "Displays the current version number.",
        },
        {
            name: "--non-interactive",
            description: "Runs in non-interactive mode.",
        },
        {
            name: "--verbose",
            description: "Enables verbose logging.",
        },
        {
            name: "--quiet",
            description: "Enables quiet mode, supresses logging unless absolutely necessary.",
        },
        {
            name: "--debug",
            description: "Enables debug logging.",
        },
        {
            name: "--domain <domain>",
            description: "Overrides the default domain to contact OpsGenie, for example to use OpsGenie EU endpoint.",
        },
    ];

    //
    // Shows general help.
    //
    private showGeneralHelp(): void {
        this.showHelp(
            {
                usage: `opsgenie <command> [options]`,
                description: `Command line interface to Opsgenie.`,
                options: this.globalOptions,
            },
            commands
        );
    }

    //
    // Shows help for a sub-command.
    //
    private showCommandHelp(command: ICommandDesc): void {
        this.showHelp(command.help, command.subCommands, this.globalOptions);
    }

    //
    // Formats help described in the "help" object.
    //
    private showHelp(commandHelp: ICommandHelp, subCommands?: ICommandDesc[], globalOptions?: IOptionHelp[]): void {

        const usage = commandHelp.usage
            .replace("<command>", `<${chalk.blueBright("command")}>`)
            .replace("[options]", `[${chalk.greenBright("options")}]`)

        this.log.info(`\nUsage: ${usage}\n`);
        this.log.info(`${commandHelp.description}`);
        
        const padding = " ".repeat(4);
        const columnPadding = 25;

        if (subCommands) {
            this.log.info(`\n${chalk.blueBright("Commands")}:`);

            for (const subCommand of subCommands) {
                this.log.info(`${padding}${subCommand.name.padEnd(columnPadding)}${subCommand.help.description}`)
            }
        }

        this.showOptions("Options", commandHelp.options, padding, columnPadding);
        this.showOptions("Global options", globalOptions, padding, columnPadding);
    }

    private showOptions(name: string, options: IOptionHelp[] | undefined, padding: string, columnPadding: number) {
        if (options) {
            this.log.info(`\n${chalk.greenBright(name)}:`);

            for (const option of options) {
                this.log.info(`${padding}${option.name.padEnd(columnPadding)}${option.description}`);
                if (option.defaultValue !== undefined) {
                    this.log.info(`${padding}${" ".padEnd(columnPadding)}Default = ${chalk.cyan(option.defaultValue)}`);
                }
            }
        }
    }
}