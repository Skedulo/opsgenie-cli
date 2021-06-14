//
// The collection of all commands.
//

import { ICommandDesc } from "./command";
import alertsCommand from "./commands/alerts";
import integrationsCommand from "./commands/integrations";

export const commands: ICommandDesc[] = [
    alertsCommand,
    integrationsCommand,
];

