//
// The collection of all commands.
//

import { IOpsgenieCommandDesc } from "./lib/opsgenie-command";
import alertsCommand from "./commands/alerts";
import integrationsCommand from "./commands/integrations";

export const commands: IOpsgenieCommandDesc[] = [
    alertsCommand,
    integrationsCommand,
];

