
//
// Interface for a command.
//
export interface ICommand {

    //
    // Invokes the command.
    //
    invoke(): Promise<void>;
}

//
// Describes the help output for a particular command.
//
export interface ICommandHelp {
    // 
    // Shows how to use the command.
    // 
    usage: string;

    //
    // Describes what the command does.
    //
    message: string;

    //
    // Describe the arguments for the command.
    //
    arguments: [string, string][];
}

//
// Describes a command.
//
export interface ICommandDesc {

    //
    // The name of the command.
    //
    name: string;

    //
    // The description of the command.
    //
    description: string;

    //
    // Constructor function for the command.
    //
    constructor: Function;

    //
    // Defines the --help hjoption output for the command.
    //
    help: ICommandHelp;
}