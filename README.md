# Northcoders House of Games API

## Instructions

Link to hosted version: [wwww.nc-games-backend-project.onrender.com]()

This is my Northcoders back end project. I have built an API, consisting of boardgame reviews, using JavaScript and Node.js. The databases are PSQL, which are interacted with using node-postgres.

In order to run this project on your local machine, after cloning, connections to the correct databases need to be made locally.

1. Set up a `.env.development` and a `.env.test file`.
2. Add the text `PGDATABASE = nc_games` and `PGDATABASE = nc_games_test` inside of each respective file.
3. Run `npm install` to install packages.
4. Run `npm run setup-dbs` to create the databases.
5. Run `npm run seed` to seed the databases.
6. Run `npm run start` to host on localhost.
7. To run tests, run `npm run test`.
