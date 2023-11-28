// implementation of the HTTP routes that make up the REST API of the web application

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
      message: "Error creating group."
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
    return { message: "Error deleting group." }
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
    const requestedUser = { name: request.body.name }
    const newUser = await secaServices.insertUser(requestedUser)

    if (newUser !== null) {
      response.status(201)
      return newUser
    }
    response.status(400)
    return { message: "Error creating user." }
  }

// Auxiliary function
function processRequest(requestProcessor, requiresAuthentication) {
  return function(request, response) {
    if (requiresAuthentication) {
      const token = getToken(request);
      if (!token) {
        return response.status(401).json("Not authorized");
      }
      request.token = token;
    }

    return requestProcessor(request, response);
  };
}
