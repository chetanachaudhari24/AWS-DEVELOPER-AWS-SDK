const AWS = require('aws-sdk');
const sns = new AWS.SNS({ region: 'us-west-2' });

const Name = 'new-signups';

(async () => {
  const params = {
    Name,
    Attributes: {
      DisplayName: 'New client signups',
    },
  };

  try {
    const response = await sns.createTopic(params).promise();
    console.log({ response });
  } catch (error) {
    console.log('Error creating topic: ', error);
  }
})();
