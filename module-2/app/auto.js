
//ir requires aws sdk library
const AWS = require('aws-sdk')

//configure region for aws cli
AWS.config.region = 'us-west-2'


//create instance of autoscaling and elastic load balancer
const autoScaling = new AWS.AutoScaling();

const elb = new AWS.ELBv2();

const { message, readJSON, sortSubnets } = require('./utils.js');


//To create launch configuration. This defines the parameters of each EC2 instance that is launched in the Auto Scaling Group.
const createLaunchConfiguration = (name) => {
    const json = readJSON('UserData')
    if (json) {
        const params = {
                "LaunchConfigurationName": name,

                "ImageId": json.ImageId,

                "InstanceType": json.InstanceType,

                "UserData": json.UserData
        }
        
        autoScaling.createLaunchConfiguration(params, message)
    }
    else{
        console.log("There was an error reading the `UserData.json` file.")
    }
};


//Each EC2 instance in the Auto Scaling Group will be behind a Load Balancer. 
const createLoadBalancer = (name) => {
    const subnets = sortSubnets(readJSON('Subnets'))
    
    if (subnets) {
        const params = {
                "Name": name,

    ﻿﻿          "Subnets": subnets
        }
        
        elb.createLoadBalancer(params, message)
    }
    else{
        console.log("There was an error reading the `Subnets.json` file. Have you run the `setup` command?")
    }
};

//Along side the Load Balancer, a Target Group is needed. The Target Group contains registered targets which are defined by a port and a protocol. In this case each EC2 instance will have a NodeJS web application (HTTP) running on port 3000.
const createTargetGroup = (name) => {
    const vpc = readJSON('Vpcs')
    
    if(vpc){
        const params = {
                "Name": name,

                "Port": 3000,

                "Protocol": "HTTP",

                "VpcId": vpc.Vpcs[0].VpcId
        }
        
        elb.createTargetGroup(params, message)
    }
    else{
        console.log("There was an error reading the `Vpcs.json` file. Have you run the `setup` command?")
    }
};


//A Listener belongs to a Load Balancer and is responsible for routing requests to the Target Group. 
const createListener = () => {
    const targetGroup = readJSON('TargetGroups')
    const loadBalancer = readJSON('LoadBalancers')
    
    if (targetGroup && loadBalancer) {
        const params = {
                "DefaultActions": [{ TargetGroupArn: targetGroup.TargetGroups[0].TargetGroupArn, Type: 'forward'}],

                "Port": 80,

                "Protocol": "HTTP",

                "LoadBalancerArn": loadBalancer.LoadBalancers[0].LoadBalancerArn
        }
        
        elb.createListener(params, message)
    }
    else{
        console.log("Have you created a Target Group and a Load Balancer?")
    }
};

const createAutoScalingGroup = (name, lcName) => {
    const targetGroup = readJSON('TargetGroups')
    
    if (targetGroup) {
        const params = {
                "AutoScalingGroupName": name,

                "AvailabilityZones": ['us-west-2a', 'us-west-2b', 'us-west-2c', 'us-west-2d'],

                "LaunchConfigurationName": lcName,

                "TargetGroupARNs": [ targetGroup.TargetGroups[0].TargetGroupArn ],

                "MaxSize": 2,

                "MinSize": 1
        }
        
        autoScaling.createAutoScalingGroup(params, message)
    }
    else{
        console.log("Have you created a Target Group?")
    }
};


//will use the ASGAverageCPUUtilization TargetTrackingScaling policy style. This means that new EC2 instances will be launched when certain CPU metrics are triggered.  
const putScalingPolicy = (name) => {
    const params = {
            "AutoScalingGroupName": name,

            "AdjustmentType": "ChangeInCapacity",

            "PolicyName": `${name}-policy`,

            "PolicyType": "TargetTrackingScaling",

            "TargetTrackingConfiguration": { 
                "TargetValue": 5,
                "PredefinedMetricSpecification": { 
                "PredefinedMetricType": "ASGAverageCPUUtilization" 
             }
            }
    }
    
    autoScaling.putScalingPolicy(params, message)
};







/****
 CLI 
****/
const cli = require('./cli.js');
switch (cli.command) {
  case    'setup': cli.setup(); break;
  case   'config': createLaunchConfiguration(cli.resourceName); break;
  case     'load': createLoadBalancer(cli.resourceName); break;
  case   'target': createTargetGroup(cli.resourceName); break;
  case 'listener': createListener(); break;
  case    'group': createAutoScalingGroup(cli.resourceName, cli.linkedResourceName); break;
  case   'policy': putScalingPolicy(cli.resourceName); break;
  default        : console.error('Not a valid command!'); break;
}


/*
COMMANDS - 
To create launch configuration - 
node auto.js config carved-rock-lc

To create load balancer - 
node auto.js load carved-rock-lb

To create target group -
node auto.js target carved-rock-tg

To create listener - 
node auto.js listener

To create auto scaling group - 
node auto.js group carved-rock-asg carved-rock-lc

To create load balancer - 
node auto.js policy carved-rock-asg
*/