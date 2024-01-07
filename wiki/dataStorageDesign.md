# Data Storage Design

## ElasticSearch

The data in our application is stored using an ElasticSearch database. The main advantages of this choice are that ElasticSearch returns data in JSON format and uses the HTTP protocol. 

Based on the structure of our data, the chosen indexes were the following:

## Users

Each User document contains:
- Id (auto-generated)
- Name (chosen by the user, unique)
- Token (UUID given by a method that generates a random string of characters)
- Password (chosen by the user)

The structure of a User document is as follows:

```json
{
    "id": "1",
    "name": "Username",
    "token": "3eac1b5d-1386-4ecd-a831-656c75c410f0",
    "pwd": "password"
}
```


Model mapping of a User document in ElasticSearch:

```json
{
    "_index": "users",
    "_id": "1",
    "_score": 1.0,
    "_source": {
        "id": "1",
        "name": "Noemi Ferreira",
        "token": "3eac1b5d-1386-4ecd-a831-656c75c410f0",
        "pwd": "1234"
    }
}
```

## Groups

Each Group document contains:
- Id (auto-generated)
- Name (chosen by the user, editable)
- Description (chosen by the user, editable)
- UserId (id of the user that owns the group)
- Events (array of objects) 

The structure of a Group document is as follows:

```json
{
    "id": "2",
    "name": "Best events ever",
    "description": "These are the best events ever",
    "userId": 2,
    "events": []
}
```

Model mapping of a Group document in ElasticSearch:

```json
{
    "_index": "groups",
    "_id": "2",
    "_score": 1.0,
    "_source": {
        "id": "2",
        "name": "Best events ever",
        "description": "These are the best events ever",
        "userId": 2,
        "events": []
    }
}
```