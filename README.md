# Social Identity Management Service
 SIMS is a very basic project aims to add social login as a method of authentication and authorization to wireless networks managed by Cisco ISE. It's built on top of Node.js/Express and use Passport.js to easily add more than 500 social login strategies
## How It Works
1. User is click on a button on ISE Guest Login Portal
2. SIMS is redirect user to the social login screen
3. User is authorize using social identity
4. Social provider redirect the user back to "please wait" page on SIMS
6. SIMS is creating/updating guest user on Cisco ISE
7. SIMS sends post request to Cisco ISE Login Portal with credentials of guest user
8. User gain access to network from ISE
## Prerequisites
For a quick start you'll don't need to have any network setup or equiqments, we will use the default configuration and test portals. so the must have list include only:
1. Cisco ISE v2.3+
    * In case you don't have Cisco ISE you can use one from DevNet sandbox or in case you have access, from Cisco dCloud where you'll even get a nice network setup to start with
2. `Desktop`/`VM`/`Server` with Node.js v8.9.3+/Docker installed
    * Machine must have network access to Cisco ISE primary node
    * SIMS is cross platform app but the instructions below written in Unix (or OS x) flavor
## Installation
```
# Clone this repository
$ git clone https://github.com/CiscoDevNet/ise-social-login-guest-authentication.git

# Go into the repository
$ cd sims

# Install dependencies (skip it in case you plan run on docker)
$ npm i
```
### Config
SIMS is using environment variables for configuration. the easiest way to manage and persist them is using the `.env` file sits on the root project directory
Configuration in the file is splitted to three parts, listed below
#### Project Settings
```
NODE_TLS_REJECT_UNAUTHORIZED=0 // Get access to Cisco ISE with no SSL cert installed
PORT=<Port we will run our server>
```
#### Cisco ISE Details
```
ISE_ADDRESS=<IP Address of our Cisco ISE PAN node>
ISE_SPONSOR_USER_NAME=<Sponsor user that will create our guest users>
ISE_SPONSOR_PASSWORD=<Password for the sponsor user>
SPONSOR_PORTAL_ID=<Sponsor portal that guest will be part of>
```
Add an instruction on the way to add sponsor-api user
Add an instruction to get the portal ID
#### Social Strategies Config
SIMS is use by default five social login strategies, you must have value for all of them to run the code (even the value is fake, there is no validation for that)
in case you want use more/less refer to the Add/Remove Login Strategies section below
```
LINKEDIN_CLIENT_ID=
LINKEDIN_SECRET=arInNEqzfCzsfivO
GITHUB_CLIENT_ID=437971f986dc7e74902a
GITHUB_SECRET=a1b8ba8352ca803dfb4cd0bf80e45c7fa1628c6c
GOOGLE_CLIENT_ID=<get it from 
GOOGLE_CLIENT_SECRET=P9rQvWNOrVM_CTXsZHREMs8Q
TWITTER_CONSUMER_KEY=2449ZTZZYNa9qhccNRwnoVvdP
TWITTER_CONSUMER_SECRET=eW7EeEzegPa6djDHkOwTlaHWNKYcssK0Ns7WqNCorG9fLle1rn
AUTH0_CONSUMER_KEY=ukSOk2kCCFnWlRwIW3FX0NOChuxM20K0
AUTH0_CONSUMER_SECRET=yBMRzGHpm_1TBFGP-V-cyV_-1mOeItMt8NuFRI1K2ueGGwEoTOVU9Q8AGUVJCgoo
AUTH0_DOMAIN=dev-nxy2jal1.auth0.com
```
_`.env` file is listed as `.gitignore` file to avoid commiting of sensitive data to source control_
## Usage
### Run the project
#### Node.js
There is two options to run the project:
`npm start`
For a quick start
`npm run dev`
To use nodemon and modify the code in realtime
#### Docker
This project has both `Dockerfile` and `docker-compose.yml` files to allow plain docker and docker-swarm running env
To use docker run
`docker build . && docker run`
To use it as a swarm service just run
`docker-compose up --build`
### Use on ISE
### Test the flow
### Add custom fields
### Add/Remove Login Strategies
