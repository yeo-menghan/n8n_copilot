const fs = require('fs');
const path = require('path');

// Define the path to the TypeScript and the JavaScript files
const tsFilePath = '/Users/yeo_menghan/documents/rockship/n8n/packages/nodes-base/nodes/ActionNetwork/ActionNetwork.node.ts';
const jsFilePath = path.join(__dirname, 'local_scrape.js');

try {
  // Read the content of the TypeScript file
  const tsFileContent = fs.readFileSync(tsFilePath, { encoding: 'utf8' });

  // Regular expression to match the desired part of the code
  // This is a simplified example; you might need a more complex one
  const regex = /description: INodeTypeDescription = {[\s\S]*?};\n\n\tmethods = {[\s\S]*?};/g;
  const match = tsFileContent.match(regex);

  if (match) {
    // Extracted part of the code
    const extractedCode = match[0];

    // Example usage: logging the extracted code
    console.log(extractedCode);

    // Optionally, write the extracted code to the JavaScript file or another destination
    // fs.writeFileSync(jsFilePath, extractedCode);
  } else {
    console.log('Desired code segment not found.');
  }
} catch (error) {
  console.error('Error reading the TypeScript file:', error);
}
