
## Installation

``npm install``

## Running

``npm run start``

## Testing

``npm test``

## Requirements

For use of this project, a ``.env`` file needs to be created on the root folder with the following environment variables:

    - PORT: for the port number used by the Express server
    - API_KEY: to define the API key used for requests to app.ticketmaster.com
    - SEED_MOVIE_CACHE: for a boolean value to force a seeding of the ticketmaster movie cache using the 250 most popular events available at app.ticketmaster.com

Below is an example of the file:
```txt
PORT=1906
API_KEY=k_1234567X
SEED_MOVIE_CACHE=false
```
