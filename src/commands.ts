//
// The collection of all commands.
//

import { IOpsgenieCommandDesc } from "./lib/opsgenie-command";
import alertsCommand from "./commands/alerts";

export const commands: IOpsgenieCommandDesc[] = [
    alertsCommand,
];

