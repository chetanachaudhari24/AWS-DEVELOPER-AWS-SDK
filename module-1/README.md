         ___        ______     ____ _                 _  ___  
        / \ \      / / ___|   / ___| | ___  _   _  __| |/ _ \ 
       / _ \ \ /\ / /\___ \  | |   | |/ _ \| | | |/ _` | (_) |
      / ___ \ V  V /  ___) | | |___| | (_) | |_| | (_| |\__, |
     /_/   \_\_/\_/  |____/   \____|_|\___/ \__,_|\__,_|  /_/ 
 ----------------------------------------------------------------- 

You work for a rock climbing company called Carved Rock Fitness on the DevOps team. You are in charge of creating, managing, and monitoring all front-end EC2 instances for the web team. For convenience and to save time, you have decided to use the AWS JavaScript SDK to build a simple console application with which you can perform the following tasks:

    Create an instance.

    Describe an instance or instances.

    Start, stop, and reboot an Instance or Instances.

    Turn monitoring on and off for an instance or instances.
    
    
    To start with project, execute following commands:
    
    1. cd app

    2. npm install
    
    These commands will change the working directory to where the code is located, and will install the AWS JavaScript SDK. To ensure that this process was successful, run the command npm ls --depth=0 at the terminal.
    
    Look for something similar to aws-sdk@<version-number>.

    With the AWS JavaScript SDK installed you'll now be able to write some code to create and manage EC2 Instances.