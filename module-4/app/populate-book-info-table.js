// Imports
const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({ region: 'us-west-2' })

// Declare local variables
const client = new AWS.DynamoDB.DocumentClient()

//fetch the data from json file
const bookData = JSON.parse(fs.readFileSync('app/bookData.json', 'utf8'));

function populateData(){
  

bookData.forEach(function(bookDataEach) {
  var params = {
      TableName: "books-info",
      Item: bookDataEach
  };

  client.put(params, function(err, data) {
     if (err) {
         console.error("Unable to add data");
     } else {
         console.log("PutItem succeeded:", bookDataEach.BookTitle );
     }
  });
});
}

// copy-paste the code below here
// It should look like:
populateData();