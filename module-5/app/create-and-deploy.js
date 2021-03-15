const aws = require('./lib/aws.js');

const apiName = 'globomantics-users';

const lambdaARN = 'arn:aws:lambda:us-west-2:289223813026:function:list-users';
const iamApiGatewayServiceRoleARN = 'arn:aws:iam::289223813026:role/APiGatewayRole';

async function createAndDeploy() {
  if (
    !lambdaARN ||
    lambdaARN.length === 0 ||
    !iamApiGatewayServiceRoleARN ||
    iamApiGatewayServiceRoleARN.length === 0
  ) {
    console.log('missing data');
    return false;
  }

  const apiData = await aws.createRestApi(apiName);
  const restApiId = apiData.id;

  const rootResources = await aws.getRootResources(restApiId);
  const rootPathId = rootResources.items[0].id;


  //The third argument to this method is the URL path the API will use to invoke the Lambda function and return the list of users.
  const usersResource = await aws.createResource(restApiId, rootPathId, 'users');
  const resourceId = usersResource.id;

  await aws.createResourceGETMethod(restApiId, resourceId);

  await aws.create200MethodResponse(restApiId, resourceId);

  await aws.createMethodIntegration(
    restApiId,
    resourceId,
    lambdaARN,
    iamApiGatewayServiceRoleARN
  );

  await aws.createMethodIntegrationResponse(restApiId, resourceId);

  aws.createDeployment(restApiId).then((data) => {
    console.log('Finished creating and deploying API Gateway');
    console.log({ restApiId, resourceId });
  });
}

createAndDeploy();



/*

1. node create-and-deploy.js
Finished creating and deploying API Gateway
{ restApiId: 'o4izbqlxtg', resourceId: '069fxm' }*/