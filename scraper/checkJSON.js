
const sample_data = {
  displayName: 'Action Network',
  name: 'actionNetwork',
  icon: 'file:actionNetwork.svg',
  group: ['transform'],
  version: 1,
  subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
  description: 'Consume the Action Network API',
  defaults: {
          name: 'Action Network',
  },
  inputs: ['main'],
  outputs: ['main'],
  credentials: [
          {
                  name: 'actionNetworkApi',
                  required: true,
          },
  ],
  properties: [
          {
                  displayName: 'Resource',
                  name: 'resource',
                  type: 'options',
                  noDataExpression: true,
                  options: [
                          {
                                  name: 'Attendance',
                                  value: 'attendance',
                          },
                          {
                                  name: 'Event',
                                  value: 'event',
                          },
                          {
                                  name: 'Person',
                                  value: 'person',
                          },
                          {
                                  name: 'Person Tag',
                                  value: 'personTag',
                          },
                          {
                                  name: 'Petition',
                                  value: 'petition',
                          },
                          {
                                  name: 'Signature',
                                  value: 'signature',
                          },
                          {
                                  name: 'Tag',
                                  value: 'tag',
                          },
                  ],
                  default: 'attendance',
          },
  ],
};

async function checkJSON(tsContent) {
  let isJSON = true;
  try {

    JSON.parse(JSON.stringify(tsContent));
    console.log("The provided data is in valid JSON format.");
  } catch (error) {
    isJSON = false;
    console.error("Error:", error);
    console.error("The provided data is not in valid JSON format.");
  }
  return isJSON;
}
// async function main() {
//   let result = await parseTypeScript(sample_)
//   console.log(result)
// }

// main()

module.exports = { checkJSON };
