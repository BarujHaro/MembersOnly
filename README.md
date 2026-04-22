# Members only app

## Description
An exclusive clubhouse where your members can write anonymous posts. Inside the clubhouse, members can see who the author of a post is, but outside they can only see the story and wonder who wrote it.

## Features
- CRUD posts
- User login and sign-up
- Authentication
- Form validation
- MVC architecture

## Tech Stack
- Node.js
- Express
- EJS
- Postgresql

## Getting Started
1. Clone the repo
2. npm install
3. npm run dev


## Screenshots
-Home page from a Non-logged user perspective
![Home](./public/screenshots/HomeNormal.png)
-Sign-up page
![Form](./public/screenshots/SignUp.png)
-Home page from a logged user perspective
![Home](./public/screenshots/HomeUser.png)


## Database Setup

This project uses PostgreSQL locally.

1. Create the database manually
2. Run the schema:

psql -U user -d db
\i db/schema.sql

3. Seed the database:

node db/seed.js