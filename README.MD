# opsgenie-cli

A command line tool for interacting with Opsgenie.

## Usage

Put the `opsgenie` executable in your path.

Set your Opsgenie API key:

```bash
export OPSGENIE_API_KEY=<api-key>
```

Run command like this one to get alerts:

```bash
opsgenie alerts
```

To get help:

```bash
opsgenie --help
```

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
npx ts-node src/index.ts integrations enable <integration-id>
```
Disable an integration:

```bash
npx ts-node src/index.ts integrations disable <integration-id>
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
