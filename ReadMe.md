## Folder Structure

```
root
│
├── client (React frontend)
│ ├── package.json
│ └── node_modules
│
├── server (Node.js backend)
│ ├── package.json
│ └── node_modules
│
└── package.json (root)
```

## How to Run This Application (At the ROOT of the FOLDER)

Follow these steps:

1. Install dependencies for the client and server:
  "dependencies": {
   "validator": "^13.12.0",
   "concurrently": "^9.0.1",
  }
```
   npm run install:client
   npm run install:server
```

2. Set up the database:

```
   npm run database
```

3. Seed the database:

```
   npm run seed
```

4. Start the application:

```
   npm run start
```

Once running, both the client and server will be available:

Visit http://localhost:3000 to see the React app.\
Visit http://localhost:3001/users to view all users.\
Visit http://localhost:3001/movies to view all movies.

## React Application Overview
The React app provides a simple interface to view and search for movies. For example, typing "The Matrix" in the search input box will display "The Matrix" along with its release date.

## Backend Features
### Endpoints:

* /users: Fetch all users from the PostgreSQL database.
* /movies: Fetch all movies from the PostgreSQL database.
* /search: Search movies by title with input sanitization to prevent SQL injection.

## User Flow
If you'd like to test other accounts I would recommend using a development testing tool such as Postman or input GET/POST request with your terminal/CLI.

### Register User:
#### Postman:
```
POST http://localhost:3001/register
Content-Type: application/json

{
    "name": "redcanary",
    "email": "redcanary@example.com",
    "password": "TestPassword123@"
}
```
#### Terminal:
```
curl -X POST \
  http://localhost:3001/register \
  -H 'Content-Type: application/json' \
  -d '{
    "name": "canary",
    "email": "redcanary@example.com",
    "password": "TestPassword123@"
  }'
  ```

### Login:
#### Postman:
```
POST http://localhost:3001/login
Content-Type: application/json

{
  "email": "admin@admin.admin",
  "password": "password"
}
```
#### Terminal:
```
curl -X POST http://localhost:3001/login \
-H 'Content-Type: application/json' \
-d '{
    "email": "test@example.com",
    "password": "TestUser123@"
}'
```


### Security Measures:

SQL Injection Detection Middleware: The server includes middleware that detects potential SQL injection patterns in the query or request body. If a malicious pattern is detected, the request is rejected, and an error is logged.
### Search Sanitization:

The /search route uses the validator library to sanitize user inputs, preventing SQL injection by escaping harmful characters and validating the search query.
## SQL Injection Demonstration
To illustrate the impact of SQL injection, a vulnerable search endpoint was initially exposed. For example, the following input would return all users from the database:
' OR 1=1; SELECT * FROM users --
This behavior highlights the dangers of SQL injection when user input is not properly sanitized.

### Task Objectives
Your main objectives in this project are:

### Identify and Fix Vulnerabilities:

Backend: Address SQL injection vulnerabilities by implementing proper input sanitization and validation.
Frontend: Prevent the injection of malicious input from the client-side application.

## Important Links
### [Sources](https://joinpursuit.notion.site/Sources-125d2512d7ba806bb762ebfd7f08c660)
###  [Trello Board](https://trello.com/invite/b/671acb59948fbe8c03727cc0/ATTI549954698c11d8ad09f7c79cd645d54e7B8B4939/red-canary-take-home)
### [JWT.io](https://jwt.io/)