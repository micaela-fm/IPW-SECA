# Application Structure

The application has 4 main modules:

## Server
This module is responsible for setting up and running the Express server, including the configuration of different middleware.

Some notable middleware are **[Passport](https://www.passportjs.org/)**, used to provide authentication capabilities to the Express application, and **[express-session](https://expressjs.com/en/resources/middleware/session.html)**, used to set up session management.

The `passport.serializeUser` function is called after the user is authenticated and is used to store the user's information in the session.
The `passport.deserializeUser` function is called on subsequent requests after the user is authenticated, and is used to retrieve the user's information from the session.

## Web (website / api)
This module is responsible for handling all web-related functionality. It includes the website and the API endpoints that handle incoming requests.

## Services (logical module)
This module contains the business logic of the application. It is responsible for performing any operations that are required to fulfill a request, such as querying the database and making external API calls.

## Data (data-mem, elastic)
This module is responsible for interacting with the data storage systems used by the application. It includes **[Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)** used for indexing and searching data.
