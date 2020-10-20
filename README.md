<h1 align="center">ExpressJS - EchteTalk RESTfull API</h1>

EchteTalk is a realtime chat application with features like real time chat, profile and location. [More about Express](https://en.wikipedia.org/wiki/Express.js)

## Built With

[![Express.js](https://img.shields.io/badge/Express.js-4.17.1-orange.svg?style=rounded-square)](https://expressjs.com/en/starter/installing.html)
[![Node.js](https://img.shields.io/badge/Node.js-v.12.18.2-green.svg?style=rounded-square)](https://nodejs.org/)

## Requirements

1. <a href="https://nodejs.org/en/download/">Node Js</a>
2. Node_modules
3. <a href="https://www.getpostman.com/">Postman</a>
4. Web Server (ex. localhost)

## How to run the app ?

1. Open app's directory in CMD or Terminal
2. Type `npm install`
3. Make new file a called **.env**, set up first [here](#set-up-env-file)
4. Turn on Web Server and MySQL can using Third-party tool like xampp, etc.
5. Create a database with the name echtetalk, and Import file sql to **phpmyadmin**
6. Open Postman desktop application or Chrome web app extension that has installed before
7. Choose HTTP Method and enter request url.(ex. localhost:3001/)
8. You can see all the end point [here](#end-point)

## Set up .env file

Open .env file on your favorite code editor, and copy paste this code below :

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_DATABASE=echtetalk

PORT=3001
IP=127.0.0.1

USER=//Your Email
PASS=//Your Password

```

## End Point

**1. GET**

- `/users/user/:id`(Get user by id)
- `/users/get/roomchat`(Get roomchat by user id and friend id)
- `/users/invite`(Get user by email)
- `/users/friend/:id`(Get friend by id)

- `/profile/:id`(Get profile by id)

- `/roomchat/chat/message/:roomchat_id`(Get message by roomchat)
- `/roomchat/chat/room/:user_id`(Get roomchat by id)
- `/roomchat/chat/user`(Get message by id)
- `/roomchat/chat/notif/:user_id`(Get notification by id)

**2. POST**

- `/users/register` (Post register)

  - `{ "user_email": "m@gmail.com", "user_password": "Cocacola12", "confirm_password": "Cocacola12" "user_name": "colacola" ,"user_phone": 081111111111, "user_lat": 111111, "user_lng": 111111}`

- `/users/login` (Post login)

  - `{ "user_email": "m@gmail.com", "user_password": "Cocacola12"}`

- `/users/friend` (Post friend)

  - `{ "user_id": 1, "friend_id": 2}`

- `/users/forgot` (Post forgot password)

  - `{ "user_email": "m@gmail.com" }`

- `/roomchat` (Post roomchat)

  - `{ "user_id": 1, "friend_id": 2}`

- `/roomchat/message` (Post message)

  - `{ "roomchat_id": 20, "user_id": 1, "friend_id": 2, "msg": "hei"}`

**3. PATCH**

- `/users/patch/location/:id` (Update location)

  - `{ "user_lat": 2222, "user_lng": 2222}`

- `/users/change?keys=xxxx` (Update password)

  - `{ "user_password": "PepsiCola12", "confirm_password": "PepsiCola12"}`

- `/profile/patch/:user_id` (Update profile)

  - `{ "user_name": "mark", "user_phone": "0822222222", "profile_bio": "I'm a web developer", "profile_picture": "cocacola.jpg"}`

**4. DELETE**

- `/users/delete/contact/:id_friend` (Delete contact)
- `/users/delete/roomchat/:roomchat_id` (Delete roomchat)

## Postman link

Link: https://documenter.getpostman.com/view/12323107/TVYC8zJq

