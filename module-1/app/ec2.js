const fs = require('fs');
const { command, instance, tag, message, keyExists, ensureKey } = require('./helpers');

/****************
AWS Configuration
*****************/

//requires aws sdk library 
const AWS = require('aws-sdk');

//set region and apiVersion
AWS.config.region = 'us-west-2';
AWS.config.apiVersions = { ec2: '2016-11-15' };

//create instance of class AWS.EC2
const ec2 = new AWS.EC2();


const keyParams = {
  KeyName: 'ec2-js-sdk-key-pair'
}

//instance - gets instance id from command line arguments
const manageParams = {
  InstanceIds: [instance]
}

switch (command) {
  default:
    console.error('Not a valid command!');
    break;
  
  
  //to generate key pair
  case 'key':
    keyExists(keyParams.KeyName , () => {
      ec2.createKeyPair(keyParams, (err, data) => {
        if(err) {
          console.error("error:", err)
        }
        else {
          
          //created private key is written to 'private.pem'
          fs.writeFileSync('private.pem', data.KeyMaterial, 'utf-8'); 
          console.log('KeyPair Created. Private Key saved to `private.pem`.');
        } 
      })
    })
    break;
    
    
    //to create ec2 instance
    case 'create':
      ensureKey(keyParams.KeyName , () =>{
        
        //required instance parameters
        const instanceParams = {
              ImageId: 'ami-09dd2e08d601bff67',

              InstanceType: 't2.nano',

              KeyName: keyParams.KeyName,

              MinCount: 1,

              MaxCount: 1
        }
        
        ec2.runInstances(instanceParams , (err, data) =>{
          if(err) {
            console.error("Error:", err)
          }
          else{
            const instanceId = data.Instances[0].InstanceId; 
            console.log(`Instance Created. InstanceId: ${instanceId}`);
          }
        })
      })
      break;
      
      
      //adds tag to ec2 instance
      case 'tag':
        const tagParams = {
              Resources: [instance],

              Tags: [{ Key: 'Name', Value: tag }]
            }
            
            ec2.createTags(tagParams , message)
        break;
      
    //to start ec2 instance  
    case 'start':
      ec2.startInstances(manageParams, message)
      break;
    
    //to stop ec2 instance   
    case 'stop':
      ec2.stopInstances(manageParams, message)
      break;
    
    ////to reboot ec2 instance 
    case 'reboot':
      ec2.rebootInstances(manageParams, message)
      break;
    
    //to terminate ec2 instance 
    case 'terminate':
      ec2.terminateInstances(manageParams, message)
      break;
    
    //to get details of  ec2 instance 
    case 'describe':
      ec2.describeInstances(manageParams, message)
      break;
    
    
    //enable monitoring for ec2 instance
    case 'monitor':
      ec2.monitorInstances(manageParams, message)
      break;
    
    //disable monitoring for ec2 instance
    case 'unmonitor':
      ec2.unmonitorInstances(manageParams, message)
      break;
  
}

