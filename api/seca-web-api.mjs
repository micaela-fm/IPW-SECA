// implementation of the HTTP routes that make up the REST API of the web application

// Dependencies
import * as secaEventsServices from ".seca-events-services.mjs"
import * as secaGroupsServices from "./services/seca-groups-services.js"
import * as secaUsersServices from "./services/seca-users-services.js"

// Events
export const popularEvents = processRequest(getPopularEvents, false)
export const searchEvents = processRequest(searchEvents, false)
// Groups
export const createGroup = processRequest(createGroup, true)
export const editGroup = processRequest(editGroup, true)
export const listGroups = processRequest(listGroups, true)
export const deleteGroup = processRequest(deleteGroup, true)
export const getGroupDetails = processRequest(getGroupDetails, true)
export const addEvent = processRequest(addEvent, true)
export const removeEvent = processRequest(removeEvent, true)
// Users
export const createUser = processRequest(createUser, false)


// Get the list of the most popular events
async function getPopularEvents(req, rsp) {
  const limit = req.query.limit
  const page = req.query.page 
  const result = await secaEventsServices.getPopularEvents(limit, page)
  return result
}

  // Search events by name
  async function searchEvents(req, rsp) {
      const eventName = req.params.name
      const limit = req.query.limit
      const page = req.query.page
      const result = await secaEventsServices.getEventsByName(eventName, limit, page)
      return result
  }

  // Create group providing its name and description
  async function createGroup(req, rsp) {
    const group = {
      name: req.body.name,
      description: req.body.description,
      events: req.body.events,
    }

    const newGroup = await secaGroupsServices.createGroup(group, req.token)

    if (newGroup !== null) {
      rsp.status(201)
      return newGroup
    }
    rsp.status(400)
    return {
      message: "Error creating group."
    }
  }

  // Edit group by changing its name and description
  async function editGroup(req, rsp) {
    const groupId = req.params.id
    const group = await secaGroupsServices.editGroup(groupId, req.body, req.token)
    return group
  }

  // List all groups
  async function listGroups(req, rsp) {
    return secaGroupsServices.getAllGroups(req.token)
  } 

  // Delete a group
  async function deleteGroup(req, rsp) {
    const group = await secaGroupsServices.deleteGroup(req.params.id, req.token)
    if (group !== null) {
      rsp.status(200)
      return group
    }
    rsp.status(400)
    return { message: "Error deleting group." }
  }

  // Get the details of a group
  async function getGroupDetails(req, rsp) {
    const groupId = req.params.id
    return secaGroupsServices.getGroup(groupId, req.token)
  }

  // Add a event to a group
  // verificar quando secaServices.addEventToGroup estiver terminada
  async function addEvent(req, rsp) {
    const event = await secaGroupsServices.addEventToGroup(req.params.id, req.params.eventId, req.token)
    if (event !== null) {
      rsp.status(201)
      return event
    }
    rsp.status(400)
    return { message: "Error adding event to group." }
  }

  // Remove a event from a group
  // verificar quando secaServices.addEventFromGroup estiver terminada
  async function removeEvent(req, rsp) {
    const event = await secaGroupsServices.deleteEventFromGroup(req.params.id, req.params.eventId, req.token)
    if (event !== null) {
      rsp.status(200)
      return event
    }
    rsp.status(400)
    return { message: "Error removing event from group." }
  }

  // Create new user, given its username
  async function createUser(req, rsp) {
    const requestedUser = { name: req.body.name }
    const newUser = await secaUsersServices.insertUser(requestedUser)

    if (newUser !== null) {
      rsp.status(201)
      return newUser
    }
    rsp.status(400)
    return { message: "Error creating user." }
  }

// Auxiliary function
function processRequest(requestProcessor, requiresAuthentication) {
  return function(req, rsp) {
    if (requiresAuthentication) {
      const token = getToken(req);
      if (!token) {
        return rsp.status(401).json("Not authorized");
      }
      req.token = token;
    }

    return requestProcessor(req, rsp);
  };
}
