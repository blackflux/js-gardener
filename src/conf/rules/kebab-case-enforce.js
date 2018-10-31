const path = require('path');

module.exports = {
  create(context) {
    const filePath = path.relative(process.cwd(), context.getFilename());

    return {
      Program() {
        if (!filePath.startsWith('flow-typed/npm/')) {
          if (filePath !== filePath.toLowerCase()) {
            context.report({
              loc: { start: { line: 0, column: 0 } },
              message: `Use Kebab Case. Upper Case found in ${filePath}`,
            });
          }
          if (filePath.split('/').some(e => e.split('.')[0].indexOf('_') > 0)) {
            context.report({
              loc: { start: { line: 0, column: 0 } },
              message: `Use Kebab Case. Invalid Underscore Found in ${filePath}`,
            });
          }
        }
      },
    };
  },
};
