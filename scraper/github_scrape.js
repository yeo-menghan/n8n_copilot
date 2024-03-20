const { Octokit, App } = require("octokit");
require('dotenv').config()

const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH
});

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

async function extractCode(code){
  // Regular expression to match the desired part of the code
  const regex = /description: INodeTypeDescription = {[\s\S]*?};\n\n\tmethods = {[\s\S]*?};/g;
  const match = code.match(regex);

  if (match) {
    const extractedCode = match[0];
    console.log(extractedCode);

    // const jsFilePath = path.join(__dirname, 'extractedCode.js');
    // fs.writeFileSync(jsFilePath, extractedCode, { encoding: 'utf8' });
    // console.log(`Extracted code was written to ${jsFilePath}`);
  } else {
    console.log('Desired code segment not found.');
  }
}

// MAIN FUNCTION
async function main() {
  try {
    const url = await getActionNode(); // Wait for the Promise to resolve
    console.log(url)
    const code = await downloadCode(url); // Pass the URL string to downloadCode
    await extractCode(code);
  } catch (error) {
    console.error(error);
  }
}

// Run the main function
main();
