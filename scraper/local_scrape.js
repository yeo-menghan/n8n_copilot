const fs = require('fs');
const path = require('path');

function extractDescriptionObject(filePath) {
  // Read the file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      return;
    }

    // Define a regular expression to match the description object pattern
    const descriptionRegex = /description:\s*{[\s\S]*?},\s*methods\s*=/;

    // Search for the pattern in the file content
    const matches = data.match(descriptionRegex);

    if (matches && matches[0]) {
      // Extract and print the matched description object
      // Note: You might want to further process the match to suit your needs
      console.log(matches[0]);
    } else {
      console.log('Pattern not found in file.');
    }
  });
}

// Specify the path to the file you want to process
const filePath = path.join('/Users/yeo_menghan/documents/rockship/n8n/packages/nodes-base/nodes/ActionNetwork/ActionNetwork.node.ts');

extractDescriptionObject(filePath);
