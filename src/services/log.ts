//
// Access to Log configuration.
//

export const ILog_id = "ILog";

export interface ILog {

    //
    // Verbose logging.
    // Enabled with --verbose command line argument.
    //
    verbose(...args: any[]): void;

    //
    // Debug logging.
    // Enabled with --debug command line argument.
    //
    debug(...args: any[]): void;

    //
    // Log output from the tool.
    //
    output(...args: any[]): void;

    //
    // Information logging.
    //
    info(...args: any[]): void;

    //
    // Log a warning.
    //
    warn(...args: any[]): void;

    //
    // Log an error.
    //
    error(...args: any[]): void;
}

export class Log implements ILog {
    
    //
    // Set to true to supress all info and verbose input.
    //
    quietMode?: boolean;

    //
    // Set to true to enable verbose logging.
    //
    enableVerbose?: boolean;

    //
    // Set to true to enable debug logging.
    //
    enableDebug?: boolean;

    constructor(argv: any) {
        this.quietMode = argv.quiet;
        this.enableVerbose = argv.verbose || argv.debug;
        this.enableDebug = argv.debug;
    }

    //
    // Verbose logging.
    // Enabled with --verbose command line argument.
    //
    verbose(...args: any[]): void {
        if (this.enableVerbose && !this.quietMode) {
            console.log(...args);
        }
    }

    //
    // Debug logging.
    // Enabled with --debug command line argument.
    //
    debug(...args: any[]): void {
        if (this.enableDebug && !this.quietMode) {
            console.log(...args);
        }
    }

    //
    // Log output from the tool.
    //
    output(...args: any[]): void {
        console.log(...args);
    }

    //
    // Information logging.
    //
    info(...args: any[]): void {
        if (!this.quietMode) {
            console.log(...args);
        }
    }

    //
    // Log a warning.
    //
    warn(...args: any[]): void {
        console.error(...args);
    }

    //
    // Log an error.
    //
    error(...args: any[]): void {
        console.error(...args);
    }

}