// implementation of the HTTP routes that make up the REST API of the web application

import toHttpResponse from "./response-errors.js"

export default function (secaServices) {
  if (!secaServices) throw errors.INVALID_ARGUMENT("secaServices")

  // http routes
  return { 
    // Events
    popularEvents: handleRequest(getPopularEvents, false),
    searchEvents: handleRequest(searchEvents, false),
    // Groups
    // For all group operations, a user token must be sent 
    // in the Authorization header using a Bearer Token.
    createGroup: handleRequest(createGroup, true),
    editGroup: handleRequest(editGroup, true),
    listsGroups: handleRequest(listGroups, true),
    deleteGroup: handleRequest(deleteGroup, true),
    getGroupDetails: handleRequest(getGroupDetails, true),
    addEvent: handleRequest(addEvent, true),
    removeEvent: handleRequest(removeEvent, true),
    // Users
    createUser: handleRequest(createUser, false)
  }

  // Get the list of the most popular events
  async function getPopularEvents(request, response) {
    const limit = request.query.limit
    const page = request.query.page 
    const result = await secaServices.getPopularEvents(limit, page)
    return result
  }

  // Search events by name
  async function searchEvents(request, response) {
      const eventName = request.params.name
      const limit = request.query.limit
      const page = request.query.page
      const result = await secaServices.getEventsByName(eventName, limit, page)
      return result
  }

  // Create group providing its name and description
  async function createGroup(request, response) {
    const group = {
      name: request.body.name,
      description: request.body.description,
      events: request.body.events,
    }

    const newGroup = await secaServices.createGroup(group, request.token)

    if (newGroup !== null) {
      response.status(201)
      return newGroup
    }
    response.status(400)
    return {
      message: "Unspecified error creating group."
    }
  }

  // Edit group by changing its name and description
  async function editGroup(request, response) {
    const groupId = request.params.id
    const group = await secaServices.editGroup(groupId, request.body, request.token)
    return group
  }

  // List all groups
  async function listGroups(request, response) {
    return secaServices.getAllGroups(request.token)
  } 

  // Delete a group
  async function deleteGroup(request, response) {
    const group = await secaServices.deleteGroup(request.params.id, request.token)
    if (group !== null) {
      response.status(200)
      return group
    }
    response.status(400)
    return { message: "Unspecified error deleting group." }
  }

  // Get the details of a group
  async function getGroupDetails(request, response) {
    const groupId = request.params.id
    return secaServices.getGroup(groupId, request.token)
  }

  // Add a event to a group
  // verificar quando secaServices.addEventToGroup estiver terminada
  async function addEvent(request, response) {
    const event = await secaServices.addEventToGroup(request.params.id, request.params.eventId, request.token)
    if (event !== null) {
      response.status(201)
      return event
    }
    response.status(400)
    return { message: "Error adding event to group." }
  }

  // Remove a event from a group
  // verificar quando secaServices.addEventFromGroup estiver terminada
  async function removeEvent(request, response) {
    const event = await secaServices.deleteEventFromGroup(request.params.id, request.params.eventId, request.token)
    if (event !== null) {
      response.status(200)
      return event
    }
    response.status(400)
    return { message: "Error removing event from group." }
  }

  // Create new user, given its username
  async function createUser(request, response) {
    const requestedUser = { name: request.name }
    const newUser = await secaServices.insertUser(requestedUser)

    if (newUser !== null) {
      response.status(201)
      return newUser
    }
    response.status(400)
    return { message: "Error creating user." }
  }

// Auxiliary functions
function handleRequest(handler, requireAuthentication) {
    return async function (request, response) {
      if (requireAuthentication) {
        const BEARER_STR = "Bearer "
        const tokenHeader = request.get("Authorization")
        if (!tokenHeader || !tokenHeader.startsWith(BEARER_STR) || tokenHeader.length <= BEARER_STR.length) {
          response.status(401).json({ error: `Invalid authentication token` })
          return
        }
        request.token = tokenHeader.split(" ")[1]
      }
      try {
        let body = await handler(request, response)
        response.json(body)
      } catch (e) {
        const response = toHttpResponse(e)
        response.status(response.status).json(response.body)
        console.log(e)
      }
    }
  }
}