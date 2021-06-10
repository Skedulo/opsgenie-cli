# Release notes for Opsgenie CLI

## 0.0.2 

- Can now filter alerts using the `--query=<query>` argument. This is in the format of an Opsgenie query like you'd use in the UI.
- Fixed output from `alerts` so it's a proper JSON array.
- Added `integrations` command to list integrations.
- Can now enable and disable integrations using `opsgenie integrations enable <integration-id>` and `opsgenie integrations disable <integration-id>`

## 0.0.1

- First release with basic `alerts` command to dump all open alerts to terminal in JSON format.