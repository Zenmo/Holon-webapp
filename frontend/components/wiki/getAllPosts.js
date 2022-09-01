function importAll(r) {
  let result = [];
  let level = { result };

  r.keys().map((fileName) =>
    fileName
      .substr(2)
      .split("/")
      .reduce((r, name, i, a) => {
        if (!r[name]) {
          // check for spaces in the title
          if (name.indexOf(" ") >= 0) {
            console.warn(
              "Document title '" +
                name +
                "' contains spaces, this is not allowed in the title and will be skipped"
            );
          } else {
            r[name] = { result: [] };
            r.result.push({ name, children: r[name].result, url: fileName.substr(2) });
          }
        }

        return r[name];
      }, level)
  );
  return result;
}

export const posts = importAll(require.context("../../pages/wiki", true, /\.mdx$/));
