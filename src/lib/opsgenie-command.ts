
//
// Interface for a command.
//
export interface IOpsgenieCommand {

    //
    // Invokes the command.
    //
    invoke(): Promise<void>;
}

//
// Describes the help output for a particular command.
//
export interface IOpsgenieCommandHelp {
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
export interface IOpsgenieCommandDesc {

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
    // Defines the --help option output for the command.
    //
    help: IOpsgenieCommandHelp;
}