# Figma Svelte Template

This is a template for creating Figma plugins or widgets. It's a very rough version at the moment so you might encounter bugs, if you do, please raise an issue and I'll do my best to take a look.

It's configured to support a range of things, such as:

- Different file types, JSON, SVG etc
- Support for PostCSS already configured
- It supports more than one UI file, which is configurable from the `manifest.json` file


# Configure

To configure it to suit your project edit the file called `figma.config.js`.

The following options are supported:

```js
{
    manifest: "manifest.json", // Optional. The path to the plugin or widget's manifest file
    src: "src", // The path to the ui and main source code. By default the template looks for ui code inside `/ui` and code inside `/code`.
    dist: "dist", // The path where you would like the compiled files to be created,
    code: true, // Optional. Specify false if you don't want Svelte to bundle the main code. Useful if you want to use another bundler for this
}
```