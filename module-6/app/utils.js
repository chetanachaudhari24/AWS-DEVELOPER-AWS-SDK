const fs = require('fs');
const path = require('path');

const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
AWS.config.apiVersions = { 's3': '2006-03-01' };

const s3 = new AWS.S3();

const message = (err, data) => {
  if (err) { console.log(`Error: ${err.message}`); }
  else if (data) { console.log(`Success: ${JSON.stringify(data, null, 2)}`); }
};

const paths = (dir, container) => {
  const files = fs.readdirSync(dir);
  container = container || [];
  files.forEach((file) => {
    if (fs.statSync(dir + "/" + file).isDirectory()) {
      container = paths(dir + "/" + file, container);
    } else {
      container.push(path.join(dir, "/", file));
    }
  });
  return container;
};

const contentType = (file) => {
  let rc = 'application/octet-stream';
  const fn = file.toLowerCase();

  if (fn.indexOf('.html') >= 0) rc = 'text/html';
  else if (fn.indexOf('.css') >= 0) rc = 'text/css';
  else if (fn.indexOf('.json') >= 0) rc = 'application/json';
  else if (fn.indexOf('.js') >= 0) rc = 'application/x-javascript';
  else if (fn.indexOf('.png') >= 0) rc = 'image/png';
  else if (fn.indexOf('.jpg') >= 0) rc = 'image/jpg';

  return rc;
};

const upload = (name, root, file) => {
  const body = fs.readFileSync(file);
  const type = contentType(file);
  const rootless = file.replace(`${root}/`, "");
  const params = { "ACL": 'public-read', "Bucket": name, "Key": rootless, "Body": body, "ContentType": type };
  s3.putObject(params, (err, data) => {
    if (err) { console.log("Error", err); } 
    else { console.log("Upload Success", data); }
  });
};

module.exports = { message, paths, upload };
