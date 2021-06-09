//
// Outputs a stream of objects in the format requrested by the user.
//

import { InjectableClass, InjectProperty } from "@codecapers/fusion";
import { isArray } from "node:util";
import { ILog, ILog_id } from "../services/log";

export interface IOutputStream {

    //
    // Starts the output stream.
    //
    start(): void;

    //
    // Add record(s) to the stream.
    //
    add(record: any | any[]): void;

    //
    // Ends the output stream.
    //
    end(): void;

}

@InjectableClass()
export class OutputStream implements IOutputStream {
    
    @InjectProperty(ILog_id)
    log!: ILog;

    //
    // Number of records output.
    //
    private count: number = 0;

    constructor() {
    }

    //
    // Starts the output stream.
    //
    start(): void {
        this.count = 0;

        this.log.output("[");
    }

    //
    // Output record(s) to the stream.
    //
    add(record: any | any[]): void {
        if (Array.isArray(record)) {
            for (const row of record) {
                if (this.count > 0) {
                    this.log.output(",");
                }
    
                this.log.output(JSON.stringify(row, null, 4));
                this.count++;
            }
        }
        else {
            if (this.count > 0) {
                this.log.output(",");
            }

            this.log.output(JSON.stringify(record, null, 4));
            this.count++;
        }
    }

    //
    // Ends the output stream.
    //
    end(): void {
        this.log.output("]");
    }

}