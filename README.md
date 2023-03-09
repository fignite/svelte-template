# Figma Svelte Template

This is a template for creating Figma plugins or widgets. It's a very rough version at the moment so you might encounter bugs, if you do, please raise an issue and I'll do my best to take a look.

It's configured to support a range of things, such as:

- Different file types, JSON, SVG etc
- Support for PostCSS already configured
- It supports more than one UI file, which is configurable from the `manifest.json` file


# Getting Started

Duplicate this repo by either forking it or cloning it.

Then run `npm install` to install the modules.

Then run `npm run build` to build the plugin or widget files.

## Config

To configure it to suit your project edit the file called `figma.config.js`.

The following options are supported:

```js
{
    manifest: "manifest.json", // Optional. The path to the plugin or widget's manifest file
    src: "src", // The path to the ui and main source code. By default the template looks for ui code inside `/ui` and code inside `/code`.
    dest: "build", // The path where you would like the compiled files to be created (this must match what's in your manifest). Warning: this folder get's deleted,
    code: true, // Optional. Specify false if you don't want Svelte to bundle the main code. Useful if you want to use another bundler for this
}
```

## File structure

- `src` This contains both `UI` and `Code` source code. See below for help on use with multiple UI files.

## Multiple UI files

To support UI files add a separate key for each UI file.

1. Edit your manifest file to point to what will be the final compiled UI files
    ```jsonc
    {
        //...
        "ui": {
            "app": "build/app.html",
            "settings": "build/settings.html",
            "import": "build/import.html"
        }
    }
    ```
2. Then structure your `src/ui` directory into individual Svelte apps.
    ```bash
        src/
            ui/
                app/
                    App.svelte
                    main.js
                settings/
                    App.svelte
                    main.js
                import/
                    App.svelte
                    main.js
    ```
