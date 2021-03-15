const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-west-2' })

const client = new AWS.DynamoDB.DocumentClient()

function getAll (tableName) {
  const params = {
    TableName: tableName
  }

  return new Promise((resolve, reject) => {
    client.scan(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

// copy-paste below here
// the code should look like this
getAll("books-info").then( data => console.log(data) );

