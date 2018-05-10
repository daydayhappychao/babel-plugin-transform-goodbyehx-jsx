"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var t = _ref.types;

    var JSX_ANNOTATION_REGEX = /\*?\s*@jsx\s+([^\s]+)/;
    var visitor = (0, _babelHelperBuilderReactJsx2.default)({
        pre: function pre(state) {
            var tagName = state.tagName;
            var args = state.args;
            if (t.react.isCompatTag(tagName)) {
                args.push(t.stringLiteral(tagName));
            } else {
                console.log(state.tagExpr)
                args.push(state.tagExpr);
            }
        },
        post: function post(state, pass) {
            state.callee = pass.get("jsxIdentifier")();
        }
    });

    visitor.Program = function (path, state) {
        var file = state.file;

        var id = state.opts.pragma || "Gbh.el";

        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = file.ast.comments[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var comment = _step.value;

                var matches = JSX_ANNOTATION_REGEX.exec(comment.value);
                if (matches) {
                    id = matches[1];
                    break;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        state.set("jsxIdentifier", function () {
            return id.split(".").map(function (name) {
                return t.identifier(name);
            }).reduce(function (object, property) {
                return t.memberExpression(object, property);
            });
        });
    };

    return { inherits: _babelPluginSyntaxJsx2.default, visitor: visitor };
};

var _babelHelperBuilderReactJsx = require("babel-helper-builder-react-jsx");

var _babelHelperBuilderReactJsx2 = _interopRequireDefault(_babelHelperBuilderReactJsx);

var _babelPluginSyntaxJsx = require("babel-plugin-syntax-jsx");

var _babelPluginSyntaxJsx2 = _interopRequireDefault(_babelPluginSyntaxJsx);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }