const { writeFile } = require('fs');
const { argv } = require('yargs');
// read environment variables from .env file
require('dotenv').config({path: '/app/process.env'});
// read the command line arguments passed with yargs
const environment = argv.environment;
const isProduction = environment === 'prod';
const targetPath = isProduction
   ? `./src/environments/environment.prod.ts`
   : `./src/environments/environment.ts`;
// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   tokenRedirect: "${process.env.TOKEN_REDIRECT}",
   logoutRedirect: "${process.env.LOGOUT_TOKEN_REDIRECT}",
   apiUri: "${process.env.API_URL}",
   cognitoClientId: "${process.env.COGNITO_CLIENT_ID}",
   cognitoBaseUrl: "${process.env.COGNITO_BASE_URL}"
};
`;
// write the content to the respective file
writeFile(targetPath, environmentFileContent, (err) => {
   if (err) {
      console.log(err);
   }
   console.log(`Wrote variables to ${targetPath}`);
});
