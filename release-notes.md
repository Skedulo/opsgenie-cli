# Release notes for Opsgenie CLI

## 0.0.4 

- Improved help system and content.

## 0.0.3

- Can now enable or disable integrations either by id or name like this `opsgenie integrations enable --id=<integration-id>` or `opsgenie integrations enable --name=<integration-name>`.
- Can now list integrations by regular expression like this `opsgenie integrations --reg=<regex>`.
- Added a `--dry-run` argument to show what will happen when making changes.

## 0.0.2 

- Can now filter alerts using the `--query=<query>` argument. This is in the format of an Opsgenie query like you'd use in the UI.
- Fixed output from `alerts` so it's a proper JSON array.
- Added `integrations` command to list integrations.
- Can now enable and disable integrations using `opsgenie integrations enable <integration-id>` and `opsgenie integrations disable <integration-id>`

## 0.0.1

- First release with basic `alerts` command to dump all open alerts to terminal in JSON format.