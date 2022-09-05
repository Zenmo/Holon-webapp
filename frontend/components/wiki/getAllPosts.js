function importAll(r) {
  let result = [];
  let level = { result };

  r.keys().map((fileName) =>
    fileName
      .substr(2)
      .split("/")
      .reduce((r, name) => {
        if (!r[name]) {
          // check for spaces in the title
          if (name.includes(" ")) {
            console.warn(
              "Document title '" +
                name +
                "' contains spaces, this is not allowed in the title and will be skipped"
            );
          } else {
            // only url when the item is an .mdx file or when there is an index.mdx available in the directory
            let url =
              (name.includes(".mdx") || fileName.includes(name + "/index.mdx")) &&
              fileName.substr(2);
            r[name] = { result: [] };
            r.result.push({ name, children: r[name].result, url: url });
          }
        }

        return r[name];
      }, level)
  );
  return result;
}

export const posts = importAll(require.context("../../pages/wiki", true, /\.mdx$/));
