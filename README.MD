# opsgenie-cli

A command line tool for interacting with Opsgenie.

## Usage

### Setup

Put the `opsgenie` executable in your path.

Set your Opsgenie API key:

```bash
export OPSGENIE_API_KEY=<api-key>
```

### Alerts

Run command like this one to get alerts:

```bash
opsgenie alerts
```

To get help:

```bash
opsgenie --help
```

### Integrations

To list integrations:

```bash
opsgenie integrations
```

To list integrations filtered by regex:

```bash
opsgenie integrations --reg=<integration-regex>
```

To disable an integration:

```bash
opsgenie integrations disable --id=<integration-id>
```

To enable an integration:

```bash
opsgenie integrations enable --id=<integration-id>
```

You can enable or disable integrations by name or regular expression using the `--name=<integration-name>` and `--reg=<integration-regex>` arguments.

## Using jq for data transformations

jq is a command line tool for working with JSON data: https://stedolan.github.io/jq/

Using jq to extract a list of integration names:

```bash
opsgenie integrations | jq ".[] | .name"
```

Getting integration names as a JSON list:

```bash
opsgenie integrations | jq "[.[] | .name]"
```

Use the `--dry-run` argument to see what changes would be applied without actually changing them.

## Development

## Pre reqs

Have Node.js v12.16.3 installed. Nexe (the bundler) doesn't yet work with Node.js 14.

Use NVM to ensure you have the right version of Node.js installed.

## Testing during development

```bash
export OPSGENIE_API_KEY=<api-key>
npx ts-node src/index.ts alerts
```

Use the debug argument to get debug logging:

```bash
npx ts-node src/index.ts alerts --debug
```

Using a search query for alerts:

```bash
npx ts-node src/index.ts alerts --query=oomkill
```

Listing integrations:

```bash
npx ts-node src/index.ts integrations
```

Enable an integration:

```bash
npx ts-node src/index.ts integrations enable --id=<integration-id>
```

Disable an integration:

```bash
npx ts-node src/index.ts integrations disable --id=<integration-id>
```

Enable an integration ny name:

```bash
npx ts-node src/index.ts integrations enable --name="Amazon RDS Test"
```

Disable an integration by name

```bash
npx ts-node src/index.ts integrations disable --name="Amazon RDS Test"
```

## Building the executable

MacOS: 

```bash
npm run build-mac
```

Windows:

```bash
npm run build-win
```

Linux:

```bash
npm run build-linux
```

Now upload the executables to GitHub releases.
