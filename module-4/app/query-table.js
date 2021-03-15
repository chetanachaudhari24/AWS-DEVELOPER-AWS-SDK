const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-west-2' })

const client = new AWS.DynamoDB.DocumentClient()

function get (tableName, bookCategory) {
  const params = {
    TableName: tableName,
    KeyConditionExpression: 'BookCategory = :bookCategory',
    ExpressionAttributeValues: {
      ':bookCategory': bookCategory,
    }
  }

  return new Promise((resolve, reject) => {
    client.query(params, (err, data) => {
      if (err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}

function getBookByName (tableName, bookCategory, bookTitle) {
    const params = {
      TableName: tableName,
      KeyConditionExpression: 'BookCategory = :bookCategory AND BookTitle = :bt',
      ExpressionAttributeValues: {
        ':bookCategory': bookCategory,
        ':bt': bookTitle
      }
    }
  
    return new Promise((resolve, reject) => {
      client.query(params, (err, data) => {
        if (err) {
          return reject(err)
        }
        resolve(data)
      })
    })
}

// copy-paste code below here
// it should look like this
get("books-info", "Fiction" ).then( data => console.log(data) );

