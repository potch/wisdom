# wisdom processer concept

To setup:

- [get node and npm](https://nodejs.org/en/download)
- in Terminal, `cd` into the `build` directory and run `npm install`

To use:

- `npm run build` will build output.
- `npm run serve` to serve the demo site.
- `npm run dev` will serve the demo site and rebuild whenever the template or build script changes.

Structure:

- `build.js` is a nodejs script that takes `wisdom.md` and generate different outputs (right now, JSON and HTML)
- `template.hbs` is an HTML [Handlebars]() template for generating
- `output/` is the directory for holding generated assets.
- `package.json` manages CLI commands and 3rd party libraries used by `build.js`
