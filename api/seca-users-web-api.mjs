// implementation of the HTTP routes that make up the REST API of the web application

// Dependencies
import * as secaServices from "../services/seca-users-services.js"

export const createUser = processRequest(createUser, false)

// Create new user, given its username
async function createUser(req, rsp) {
    const userName = { name: req.body.name }
  
    if(secaServices.insertUser(userName)) {
      return rsp.status(201).json({"user-token": user.token})
    } 
    rsp.status(400).json("User already exists")
  }