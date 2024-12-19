# Notable

<p>It's a Note making web app build in MERN stack where you can write your notes, create notebooks and tag each note to filter out notes</p>
<p>It's a Note making web app build in MERN stack showing all CRUD operations.</p>

[Preview](https://amit-general-bucket.s3.ap-south-1.amazonaws.com/videos/notable.mp4)

## Table of Contents

- [Description](#description)
- [Features](#features)
- [Tech](#tech)
- [Screenshots](#screenshots)

## Description

This is a Note making website like any other websites like Evernote, Notion etc. where you can make notes about the study, time table, personal diary or any other stuff that you don't want to forget.

## Features

- used passport.js for Google OAuth Login or custom Email and Password login
- user password hashed using bcrypt before saving into database
- send reset passowrd link to user email in case of forgot password
- ejs is used to create a HTML template to send to user email
- apply express.js middleware to protect routes and data
- making all CRUD operations to MongoDB database using Mongoose
- to maintain continuous user session, jsonwebtoken is used
- sentry added for effective error monitoring while production
- global error handling in one place - globalErrorHandler.js

## Tech

<ul>
<li>Node JS</li>
<li>Express JS</li>
<li>MongoDB - <i>NoSQL databse to store user data</i></li>
<li>Passprt JS - <i>for Google OAuth login</i></li>
<li>bcryptjs - <i>for hashing user password</i></li>
<li>jsonwebtoken - <i>for creating token that maintain user logged in</i></li>
<li>nodemailer - <i>send link to email to create new password in case of forgot password</i></li>
<li>ejs - <i>create a HTML template to send link to user email</i></li>
</ul>

## Screenshots

Here are the screenshots of my project:

![Project Screenshot 1](https://notable-client.s3.ap-south-1.amazonaws.com/images/notable1.png)

![Project Screenshot 2](https://notable-client.s3.ap-south-1.amazonaws.com/images/notable2.png)
