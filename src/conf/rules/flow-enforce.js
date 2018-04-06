module.exports = {
  create(context) {
    const firstLine = context.getSourceCode().getLines()[0];

    return {
      Program() {
        if (firstLine !== '// @flow') {
          context.report({
            loc: { start: { line: 0, column: 0 } },
            message: "Expected line to equal '// @flow'"
          });
        }
      }
    };
  }
};
