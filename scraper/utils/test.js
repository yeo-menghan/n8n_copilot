const ts = require("typescript");

function findVariablesWithType(codeText, typeName) {
  const sourceFile = ts.createSourceFile(
    "code.ts",
    codeText,
    ts.ScriptTarget.ES2015,
    true
  );

  const variables = [];

  function visit(node) {
    if (ts.isVariableStatement(node)) {
      node.declarationList.declarations.forEach(declaration => {
        // Check if the declaration's type is an array type and its element type matches our target
        if (declaration.type && ts.isArrayTypeNode(declaration.type)) {
          const arrayElementType = declaration.type.elementType;
          if (arrayElementType && ts.isTypeReferenceNode(arrayElementType) && arrayElementType.typeName.getText(sourceFile) === typeName) {
            variables.push(declaration.name.getText(sourceFile));
          }
        }
      });
    }

    ts.forEachChild(node, visit);
  }

  visit(sourceFile);

  return variables;
}

const codeText = `export const personOperations: INodeProperties[] = [
    // TypeScript code here
];`;

const typeName = "INodeProperties";
const variables = findVariablesWithType(codeText, typeName);

console.log("Variables with type", typeName, ":", variables);
