const fs = require("fs");
const Handlebars = require("handlebars");
const markdown = require("markdown-it");
const prettier = require("prettier");

async function build() {
  // configure the markdown parser
  const md = new markdown({ html: true, typographer: true });

  // load the template
  const template = Handlebars.compile(
    fs.readFileSync("./template.hbs").toString("utf8")
  );

  // create our list of wisdoms
  const wisdoms = [];

  console.log("loading wisdoms");
  // get file contents
  const raw = fs.readFileSync("../wisdom.md").toString("utf8");
  // instead of converting straight to HTML, get the parsed markdown for processing.
  const tokens = md.parse(raw, {});
  console.log("parsing wisdoms");
  tokens.forEach((t, i, tokens) => {
    // find list items
    if (t.type === "list_item_open") {
      // skip to the content of the list item
      if (tokens[i + 2].type === "inline") {
        const content = md.renderInline(tokens[i + 2].content, {});
        // check for related-y things and add them to the previous wisdom.
        if (
          content.startsWith("Related:") ||
          content.startsWith("Corollary:") ||
          content.startsWith("Relatedly related:") ||
          content.startsWith("Related corollary:") ||
          content.startsWith("Thus:") ||
          content.startsWith("Unrelated:") ||
          content.startsWith("Relatedly unrelated:")
        ) {
          wisdoms[wisdoms.length - 1] += "<br>" + content;
        } else {
          // okay no related text, add a new wisdom
          wisdoms.push(content);
        }
      }
    }
  });

  // make the output directory if it doesn't exist
  try {
    fs.mkdirSync("./output/", { recursive: true });
  } catch (e) {
    if (e.code !== "EEXIST") {
      throw e;
    }
  }

  // write wisdom json
  fs.writeFileSync("./output/wisdom.json", JSON.stringify(wisdoms, null, 4));

  // if you feel like having HTML as well
  // load the markdown and convert to HTML
  const content = md.renderer.render(tokens, {});

  // render the full HTML using the template
  const html = template({ content });

  // write the output html
  fs.writeFileSync(
    "./output/index.html",
    await prettier.format(html, { parser: "html" })
  );

  // provide reassuring output
  console.log("all done!");
}

// run the build function
build().catch((e) => console.error(e));
