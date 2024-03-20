const { Octokit, App } = require("octokit");
require('dotenv').config()
const { parseTypeScript } = require("./parseTypeScript")

const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH
});

// Function to fetch a node from a GitHub repository given its file path
async function getNode(file_path){
  try{
    const result = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
      owner: 'n8n-io',
      repo: 'n8n',
      path: file_path, // 'packages/nodes-base/nodes/ActionNetwork/ActionNetwork.node.ts'
      headers: {
        'X-GitHub-Api-Version': '2022-11-28'
      }
    });

    let url = result.data.download_url
    // console.log(url)
    console.log(`Success! Status: ${result.status}. Rate limit remaining: ${result.headers["x-ratelimit-remaining"]}`)
    return url
  } catch (error) {
    console.log(`Error! Status: ${error.status}. Rate limit remaining: ${error.headers["x-ratelimit-remaining"]}. Message: ${error.response.data.message}`)
  }
}

// Function to download code from a given URL
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

// Function to fetch and parse a file from a GitHub repository
async function fetchAndParseFile(file_path){
  const url = await getNode(file_path)
  const code = await downloadCode(url);
  // console.log(code)
  // const parsedJson = parseTypeScript(code)
  // return parsedJson
  parseTypeScript(code)
}

async function main(){
  file_path = 'packages/nodes-base/nodes/ActionNetwork/descriptions/AttendanceDescription.ts';
  fetchAndParseFile(file_path);
}

main()

module.exports = { fetchAndParseFile };
