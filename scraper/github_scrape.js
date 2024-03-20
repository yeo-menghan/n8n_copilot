const { Octokit, App } = require("octokit");
require('dotenv').config()


const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH
});

// async function createIssue() {
//   await octokit.request("POST /repos/{owner}/{repo}/issues", {
//     owner: "octocat",
//     repo: "Spoon-Knife",
//     title: "Created with the REST API",
//     body: "This is a test issue created by the REST API",
//   });
// }

async function getProduct(){
  try {
    const result = await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "yeo-menghan",
      repo: "email_eval",
      per_page: 2,
    });

    console.log(result)
    console.log(`Success! Status: ${result.status}. Rate limit remaining: ${result.headers["x-ratelimit-remaining"]}`)

  } catch (error) {
    console.log(`Error! Status: ${error.status}. Rate limit remaining: ${error.headers["x-ratelimit-remaining"]}. Message: ${error.response.data.message}`)
  }
}

async function getActionNode(){
  try{
    const result = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'n8n-io',
      repo: 'n8n',
      path: 'packages/nodes-base/nodes/ActionNetwork/ActionNetwork.node.ts',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    console.log(result.data.download_url)
    console.log(`Success! Status: ${result.status}. Rate limit remaining: ${result.headers["x-ratelimit-remaining"]}`)
    return result.data.download_url
  } catch (error) {
    console.log(`Error! Status: ${error.status}. Rate limit remaining: ${error.headers["x-ratelimit-remaining"]}. Message: ${error.response.data.message}`)
  }
}

async function downloadCode(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const code = await response.text();
    // console.log(code);
    return code
  } catch (error) {
    console.error(`Could not fetch the code: ${error}`);
  }
}


// MAIN FUNCTION
async function main() {
  try {
    const url = await getActionNode(); // Wait for the Promise to resolve
    console.log(url)
    const code = await downloadCode(url); // Pass the URL string to downloadCode

    // Regular expression to match the desired part of the code
    const regex = /description: INodeTypeDescription = {[\s\S]*?};\n\n\tmethods = {[\s\S]*?};/g;
    const match = code.match(regex);

    if (match) {
      // Extracted part of the code
      const extractedCode = match[0];

      // Log the extracted code
      console.log(extractedCode);

      // Optionally, you might want to write the extracted code to a file
      // Ensure you have the path where you want to write the file
      const jsFilePath = path.join(__dirname, 'extractedCode.js');
      fs.writeFileSync(jsFilePath, extractedCode, { encoding: 'utf8' });
      console.log(`Extracted code was written to ${jsFilePath}`);
    } else {
      console.log('Desired code segment not found.');
    }

  } catch (error) {
    console.error(error);
  }
}

// Run the main function
main();
