const { Octokit, App } = require("octokit");
require('dotenv').config()


const octokit = new Octokit({
  auth: process.env.GITHUB_AUTH
});

async function createIssue() {
  await octokit.request("POST /repos/{owner}/{repo}/issues", {
    owner: "octocat",
    repo: "Spoon-Knife",
    title: "Created with the REST API",
    body: "This is a test issue created by the REST API",
  });
}

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

    console.log(result)
    console.log(`Success! Status: ${result.status}. Rate limit remaining: ${result.headers["x-ratelimit-remaining"]}`)
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
    console.log(code);
  } catch (error) {
    console.error(`Could not fetch the code: ${error}`);
  }
}

const url = 'https://raw.githubusercontent.com/n8n-io/n8n/master/packages/nodes-base/nodes/ActionNetwork/ActionNetwork.node.ts';
downloadCode(url);


// createIssue();
// getProduct();
// getActionNode();
