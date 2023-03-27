const fs = require('fs');
const dotenv = require('dotenv');
// get variable from example even.example
const envExemploKeys = Object.keys(
  dotenv.config({
    path: '.env.example',
  }).parsed
);

/*  */
const env = envExemploKeys.reduce((storage, currentKey) => {
  return `${storage}${currentKey}=${process.env[currentKey]}\n`;
}, '');

// this variable, search for values inside process.env
// created a new file .env with this variable e your values
fs.writeFileSync('.env', env);
