![APP Logo](https://i.imgur.com/PjXNIt6.jpg)


# Bon Voyage:
### Bon Voyage is an application that allows for a user to see other posts from users and post/edit/delete their own posts. I created this app so that a user could have a list of places to go to when traveling both abroad and in their home country!

## Set Up Steps

1. Download the express-api-template
2. Move the .zip file to your wdi/projects/ directory and Unzip it (creating a folder)
3. Rename the directory from express-api-template -> your-app-name.
4. Empty README.md and fill with your own content.
5. Move into the new project and git init.
6. Replace all instances of 'express-api-template' with your app name.
7. Install dependencies with npm install.
8. Ensure that you have nodemon installed by running npm install -g nodemon.
9. Ensure the API is functioning properly by running npm run server.
10. Once everything is working, make an initial commit.
11. Follow the steps in express-api-deployment-guide

## Important Links
- [Front-End Repo](https://github.com/JasTaylor/BonVoyage)
- [Back-End Repo](https://github.com/JasTaylor/Capstone-backend)
- [Deployed Site](https://jastaylor.github.io/BonVoyage/#/)
- [HEROKU Site](https://floating-sands-69159.herokuapp.com/places)

## Important Links
I began my planning process with my wireframes and ERD. I started building my back end first. I chose MongoDB so that I would be able to make changes to my scheme as I progressed in my project. I created my place model using a mongoose schema and express for my resource routes. Once this all worked correctly, I moved onto create my front end using React. Once I had all my CRUD processes working in the front end, I added AWS for image uploading to my backend using the npm package multer.

## User Stories
- As a user, I would like to be able to get/see places as an an unauthenicated user.
- As a user, I would like to be able to create, edit and delete new places for all users to see.
- As a user, I would like to be able to filter places by country.
- As a user, I would like to be able to sign-in, sign-out, and change my password.

## Technologies Used in this Back End Repository
- MongoDB
- Mongoose
- Express
- Amazon Web Services
- NPM Package - Multer-s3

### Authentication

| Verb   | URI Pattern            |
|--------|------------------------|
| POST   | `/sign-up`             |
| POST   | `/sign-in`             |
| PATCH  | `/change-password `    |
| DELETE | `/sign-out `           |
| GET    | `/places`              |
| GET    | `/places/:id`          |
| POST   | `/createplace`         |
| PATCH  | `/places/:id/edit`     |
| DELETE | `/places/:id`          |


## Unsolved Problems
- I would love to be able to have a user be able to add comments to each place when a user clicks on a place
- I would also like to have a user be able to save a place and add it to their "saved" places
- I would like to add a like feature for each place

## Images
![APP Logo](https://i.imgur.com/PjXNIt6.jpg)
![APP Logo](https://i.imgur.com/PjXNIt6.jpg)
![APP Logo](https://i.imgur.com/PjXNIt6.jpg)

## ERD
![ERD](https://i.imgur.com/eqNHMby.jpg)
