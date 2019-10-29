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
```bash
# Clone this repository
$ git clone https://github.com/CiscoDevNet/ise-social-login-guest-authentication.git

# Go into the repository
$ cd sims

# Install dependencies (skip it in case you plan run on docker)
$ npm i
```
## Config
SIMS is using environment variables for configuration. the easiest way to manage and persist them is using the `.env` file sits on the root project directory

Configuration in the file is splitted to three parts, listed below
#### Project Settings
```javascript
NODE_TLS_REJECT_UNAUTHORIZED=0 // Get access to Cisco ISE with no SSL cert installed
HOSTNAME=<Hostname that we will run our server, used for callback redirection>
PORT=<Port we will run our server>
```
#### Cisco ISE Details
```javascript
ISE_ADDRESS=// IP Address of our Cisco ISE PAN node
ISE_SPONSOR_USER_NAME=// Sponsor user that will create our guest users
ISE_SPONSOR_PASSWORD=// Password for the sponsor user
SPONSOR_PORTAL_ID= // Sponsor portal that guest will be part of
```
Add an instruction on the way to add sponsor-api user
Add an instruction to get the portal ID
#### Social Strategies Config
SIMS is use by default five social login strategies. For strategies modifications refer to the Add/Remove Login Strategies section below. Pay attention that missing config property will fail the application
```javascript
LINKEDIN_CLIENT_ID=
LINKEDIN_SECRET=
GITHUB_CLIENT_ID=
GITHUB_SECRET=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
TWITTER_CONSUMER_KEY=
TWITTER_CONSUMER_SECRET=
AUTH0_CONSUMER_KEY=
AUTH0_CONSUMER_SECRET=
AUTH0_DOMAIN=
```

_`.env` file is listed as `.gitignore` file to avoid commiting of sensitive data to source control_


## Usage
### Run the project
#### Node.js
From the project directory, Run:

* `npm start` _for a quick up'n'running_
* `npm run dev` _to use nodemon and modify the code in realtime_

#### Docker
This project has both `Dockerfile` and `docker-compose.yml` files to allow plain docker and docker-swarm running env


From the project directory, Run:

* `docker build . && docker run` to build docker image and run it
* `docker-compose up --build` to use it as a swarm service just run
### Use on ISE
### Test the flow
### Add custom fields
### Add/Remove Login Strategies
