const fs = require('fs');
const path = require('path');

const { message, paths, upload } = require('./utils.js');

/******************
 AWS Configuration 
******************/
const AWS = require('aws-sdk')
AWS.config.region = 'us-west-2'
AWS.config.apiVersions = { 's3': '2006-03-01' }

const s3 = new AWS.S3();

const createUpload = (name, dir) => {
 s3.createBucket({
      "Bucket": name,

    "ACL": "public-read"
 }, (err, data) => {
  if(err){
  console.error("Error:", err)
 }
 else{
  
  //The first line creates an array of all file paths of the directory to be uploaded. The last line uploads each file.
  const files = paths(dir); 
  files.forEach(file => upload(name, dir, file));
 }
 })
 
 
};

const enableWebsiteConfig = (name, index, error) => {
 const params = {
      "Bucket": name,

    "WebsiteConfiguration": { 
       "IndexDocument": { "Suffix": index },
       "ErrorDocument": { "Key": error }
    }
 }
 
 s3.putBucketWebsite(params, message)
};

const getWebsiteConfig = (name) => {
 s3.getBucketWebsite({"Bucket": name}, message)
};

const disableWebsiteConfig = (name) => {
 s3.deleteBucketWebsite({"Bucket": name}, message)
};

/****
 CLI 
****/
const cli = require('./cli.js');
switch (cli.command) {
  case  'create': createUpload(cli.resource, cli.dir_index); break;
  case     'get': getWebsiteConfig(cli.resource); break;
  case  'enable': enableWebsiteConfig(cli.resource, cli.dir_index, cli.error); break;
  case 'disable': disableWebsiteConfig(cli.resource); break;
  default       : console.error('Not a valid command!'); break;
}


/*
1. node web.js create <bucket-name> static


2. node web.js enable <bucket-name> index.html error.html

node web.js get <bucket-name>

The enable command will set up the static website configuration. The get command will list the static website configuration of the specified bucket, and a JSON object including those two html file names will be output.

*/