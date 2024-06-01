# Northcoders News API - Back-End - MYE

## Project Introduction

The project is about building back-end API for the purpose of accessing application data programmatically. The project is working phase to build on front-end architecture


## Connect to the Back-End News API using host- Render

https://be-news-api-server.onrender.com/api


## Instruction on running the repo locally

1. To clone the project, click on the hyperlink below and in your terminal type **git clone**
https://github.com/messat/BE-News-API-NC 

2. To install dependencies, use **npm install** command in the terminal to download all packages to the local repo. **npm ls** command will list all the current npm packages installed in this repo. Please check the dependencies match the packages listed in package.json file. 

3. To seed the database locally, run the command in the terminal **npm run seed**. 

4. Jest and supertest are packages used to run the test. Enter the following command in the terminal **npm run test** - this will run test file named newsAPI.test.js

5. To run this application locally, **node** and **Postgres** must be installed.
Minimum requirements: node version 21.7.1.  Postgress 10.5.0
  

## Instructions on how to connect to two databases

1. Please make two files in the root directory named 
**.env.test**  and **.env.development**

2. In the **.env.test** file please enter database name :  **PGDATABASE=[CHOOSE YOUR DATABASE NAME]**

3. In the **.env.development** file please enter database name :  **PGDATABASE=[CHOOSE YOUR DATABASE NAME]**

