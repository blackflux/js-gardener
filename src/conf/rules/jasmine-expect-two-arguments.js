module.exports = context => ({
  CallExpression: (node) => {
    if (node.callee.name === 'expect') {
      // checking "expect()" arguments
      if (node.arguments.length > 1) {
        if (node.arguments.length === 2) {
          if (['Literal', 'TemplateLiteral'].indexOf(node.arguments[1].type) === -1) {
            context.report({
              message: 'Expected second argument to be debug string',
              node,
            });
          }
        } else {
          context.report({
            message: 'More than one argument passed to expect()',
            node,
          });
        }
      } else if (node.arguments.length === 0) {
        context.report({
          message: 'No arguments passed to expect()',
          node,
        });
      }
    }
  },
});
