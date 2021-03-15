const fs = require('fs');

const AWS = require('aws-sdk');
AWS.config.region = 'us-west-2';
AWS.config.apiVersions = { 's3': '2006-03-01' };

const s3 = new AWS.S3();

const message = (err, data) => {
  if (err) { console.log(`Error: ${err.message}`); }
  else if (data) { console.log(`Success: ${JSON.stringify(data, null, 2)}`); }
};

const readJSON = (filename) => fs.existsSync(`policies/${filename}.json`) ? JSON.parse(fs.readFileSync(`policies/${filename}.json`)) : undefined;

const emptyBucket = async Bucket => {
  try {
    const { Contents } = await s3.listObjects({ Bucket }).promise();
    if (Contents.length > 0) {
      await s3 .deleteObjects({
          Bucket,
          Delete: {
            Objects: Contents.map(({ Key }) => ({ Key }))
          }
        }).promise();
    }
    return true;
  } catch (err) {
    console.log("\n", err, "\n");
    return false;
  }
};

module.exports = { message, readJSON, emptyBucket };
