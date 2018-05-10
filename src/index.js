import helper from "babel-helper-builder-react-jsx";
import jsx from "babel-plugin-syntax-jsx";

export default function ({ types: t }) {
  const JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;

  const visitor = helper({
    pre(state) {
      const tagName = state.tagName;
      const args = state.args;
      console.log(tagName)
      console.log(t.react.isCompatTag(tagName))
      if (t.react.isCompatTag(tagName)) {
        args.push(t.stringLiteral(tagName));
      } else {
        args.push(state.tagExpr);
      }
    },

    post(state, pass) { state.callee = pass.get("jsxIdentifier")(); }
  });

  visitor.Program = function (path, state) {
    const { file } = state;
    let id = state.opts.pragma || "Gbh.el";

    for (const comment of (file.ast.comments)) {
      const matches = JSX_ANNOTATION_REGEX.exec(comment.value);
      if (matches) {
        id = matches[1];
        break;
      }
    }

    state.set("jsxIdentifier",
      () => id.split(".")
        .map((name) => t.identifier(name))
        .reduce((object, property) =>
          t.memberExpression(object, property)));
  };

  return { inherits: jsx, visitor };
}