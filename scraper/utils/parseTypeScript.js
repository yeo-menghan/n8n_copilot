const { checkJson } = require("./checkJson")
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
        // Now, we check if the declaration's type is an array type and its element type matches our target
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

/*
  Input: Typescript file
  Output: A continuous json blob of the current typescript file AND the file paths to child json
*/
/*
  Thoughts:
  return the jsons in arrays (sequential), if there's a break in the json string, means that there's a file extension ...
  the value in the array will be separated by the extension
  hence, will separate those file extensions into their own cells for recursive calls into their file extension
  Once done, the arrays will combine into continuous json blob up until the root node typescript file
*/
async function parseTypeScript(tsContent) {
  // const regex = /export\s+const\s+([a-zA-Z0-9_]+)\s*:\s*INodeProperties\[\s*\]/; // find all const
  // const matches = tsContent.matchAll(regex);

  // const constants = [];
  // for(const match of matches){
  //   if(checkJson(match)){
  //     prettified_match = JSON.stringify(match[0], null, 2)
  //     console.log(prettified_match)
  //     constants.push(prettified_match)
  //   }
  // }

  const typeName = "INodeProperties";
  const variables = findVariablesWithType(tsContent, typeName);
  console.log("Variables with type", typeName, ":", variables);
}

module.exports = { parseTypeScript };

// // Define the TypeScript object (remove TypeScript specific types when embedding in JavaScript)
// const personOperations = [
//   {
//     displayName: 'Operation',
//     name: 'operation',
//     type: 'options',
//     noDataExpression: true,
//     displayOptions: {
//       show: {
//         resource: ['person'],
//       },
//     },
//     options: [
//       {
//         name: 'Create',
//         value: 'create',
//         action: 'Create a person',
//       },
//       {
//         name: 'Get',
//         value: 'get',
//         action: 'Get a person',
//       },
//       {
//         name: 'Get Many',
//         value: 'getAll',
//         action: 'Get many people',
//       },
//       {
//         name: 'Update',
//         value: 'update',
//         action: 'Update a person',
//       },
//     ],
//     default: 'create',
//   },
// ];

// // Convert the object to a JSON string
// const jsonString = JSON.stringify(personOperations[0], null, 2); // The '2' argument here is for pretty-printing

// // Output the JSON string to console or use as needed
// console.log(jsonString);

// // If you need to work with the JSON object programmatically, just use 'personOperations' directly in your code.
