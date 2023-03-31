const fs = require('fs');
const dotenv = require('dotenv');
// get variable from example even.example
const envExemploKeys = Object.keys(
<<<<<<< HEAD
   dotenv.config({
      path: '.env.example',
   }).parsed
=======
  dotenv.config({
    path: '.env.example',
  }).parsed
>>>>>>> origin/main
);

/*  */
const env = envExemploKeys.reduce((storage, currentKey) => {
<<<<<<< HEAD
   return `${storage}${currentKey}=${process.env[currentKey]}\n`;
=======
  return `${storage}${currentKey}=${process.env[currentKey]}\n`;
>>>>>>> origin/main
}, '');

// this variable, search for values inside process.env
// created a new file .env with this variable e your values
fs.writeFileSync('.env', env);
