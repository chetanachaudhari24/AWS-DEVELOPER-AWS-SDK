         ___        ______     ____ _                 _  ___  
        / \ \      / / ___|   / ___| | ___  _   _  __| |/ _ \ 
       / _ \ \ /\ / /\___ \  | |   | |/ _ \| | | |/ _` | (_) |
      / ___ \ V  V /  ___) | | |___| | (_) | |_| | (_| |\__, |
     /_/   \_\_/\_/  |____/   \____|_|\___/ \__,_|\__,_|  /_/ 
 ----------------------------------------------------------------- 


One of the main software applications of your business is showing a performance bottleneck. After some investigation, it was found the bottleneck is on the sign up process, and the reason for such is due to the fact that a few external services are being invoked as part of the main request, when a new user submits the sign up form.

You were tasked with exploring how to leverage AWS SNS as a way to offload some of this work off of the main request.

Execute following commands at start of project 

cd app
npm install
