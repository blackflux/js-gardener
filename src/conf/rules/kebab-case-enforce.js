const path = require("path");

module.exports = {
  create(context) {
    const filePath = context.getFilename();
    const fileName = path.basename(filePath);

    return {
      Program() {
        if (fileName !== fileName.toLowerCase()) {
          context.report({
            loc: { start: { line: 0, column: 0 } },
            message: `Use Kebab Case. Upper Case found in ${filePath}`
          });
        }
      }
    };
  }
};
