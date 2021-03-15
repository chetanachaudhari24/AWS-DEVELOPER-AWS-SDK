const AWS = require('aws-sdk');
const sns = new AWS.SNS({ region: 'us-west-2' });

const TopicArn = 'arn:aws:sns:us-west-2:168645854002:new-signups';
const messages = [
  { user: 'Sam', email: 'sam@example.com' },
  { user: 'Brooke', email: 'brooke@example.com' },
];

messages.forEach((message) => {
  publishSignupMessage(message);
});

async function publishSignupMessage(message) {
  const params = {
    TopicArn,
    MessageStructure: 'json',
    Message: JSON.stringify({
      default: JSON.stringify(message),
    }),
  };

  try {
    const response = await sns.publish(params).promise();
    console.log({ response });
  } catch (error) {
    console.log('Error publishing message: ', error);
  }
}


/*node publish-message.js*/