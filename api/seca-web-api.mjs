// Dependencies
import errorToHttp from './errors-to-http-responses.mjs'
import errors from '../common/errors.mjs'

export default function (secaEventsServices, secaGroupsServices, secaUsersServices) {
  if (!secaEventsServices)
    throw errors.INVALID_ARGUMENT("secaEventsServices")
  if (!secaGroupsServices)
    throw errors.INVALID_ARGUMENT("secaGroupsServices")
  if (!secaUsersServices)
    throw errors.INVALID_ARGUMENT("secaUsersServices")

  return {
    getPopularEvents: processRequest(_getPopularEvents, false),
    searchEvents: processRequest(_searchEventsByName, false),
    createGroup: processRequest(_createGroup, true),
    editGroup: processRequest(_editGroup, true),
    listGroups: processRequest(_listAllGroups, true),
    deleteGroup: processRequest(_deleteGroup, true),
    getGroupDetails: processRequest(_getGroupDetails, true),
    addEvent: processRequest(_addEventToGroup, true),
    removeEvent: processRequest(_removeEvent, true),
    createUser: processRequest(_createUser, false)
  }

  // Get the list of the most popular events
  async function _getPopularEvents(req, rsp) {
    const size = req.query.size
    const page = req.query.page
    const events = await secaEventsServices.getPopularEvents(size, page)
    return rsp.json(events)
  }

  // Search events by name
  async function _searchEventsByName(req, rsp) {
    const keyword = req.params.keyword
    const size = req.query.size
    const page = req.query.page
    const events = await secaEventsServices.getEventsByName(keyword, size, page)
    return rsp.json(events)
  }

  // Create group providing its name and description
  async function _createGroup(req, rsp) {
    const newGroup = {
      name: req.body.name,
      description: req.body.description
      // events: req.body.events,
    }

    const group = await secaGroupsServices.createGroup(newGroup, req.token)
    rsp.status(201).json(group)
  }

  // Edit group by changing its name and description
  async function _editGroup(req, rsp) {
    const groupId = req.params.id
    const newGroup = {
      name: req.body.name,
      description: req.body.description
    }

    const group = await secaGroupsServices.editGroup(groupId, newGroup, req.token)
    rsp.json(group)
  }

  // List all groups
  async function _listAllGroups(req, rsp) {
    const groups = await secaGroupsServices.getAllGroups(req.token)
    rsp.json(groups)
  }

  // Delete a group
  async function _deleteGroup(req, rsp) {
    const groupId = req.params.id
    const group = await secaGroupsServices.deleteGroup(groupId, req.token)
    rsp.json(`Group ${groupId} deleted`)
  }

  // Get the details of a group
  async function _getGroupDetails(req, rsp) {
    const groupId = req.params.id
    const group = await secaGroupsServices.getGroup(groupId, req.token)
    if (group)
      return rsp.json(group)
    rsp.status(404).json(`Group ${groupId} not found`)
  }

  // Add a event to a group
  async function _addEventToGroup(req, rsp) {
    const groupId = req.params.id
    const eventId = req.params.eventId
    const event = await secaGroupsServices.addEventToGroup(groupId, eventId, req.token)
    rsp.json(`Event ${eventId} added to group ${groupId}`)
  }

  // Remove an event from a group
  async function _removeEvent(req, rsp) {
    const groupId = req.params.id
    const eventId = req.params.eventId
    const event = await secaGroupsServices.deleteEventFromGroup(groupId, eventId, req.token)
    rsp.json(`Event ${eventId} removed from group ${groupId}`)
  }

  // Create new user, given its username
  async function _createUser(req, rsp) {
    const userName = { name: req.body.name }

    if (secaUsersServices.insertUser(userName)) {
      return rsp.status(201).json({ "user-token": user.token })
    }
    rsp.status(400).json("User already exists")
  }


  // Auxiliary functions
  function processRequest(requestProcessor, requiresAuthentication) {
    return async function (req, rsp) {
      if (requiresAuthentication) {
        const token = getToken(req);
        if (!token) {
          rsp
            .status(401)
            .json({ error: `Invalid authentication token` })
        }
      }
      try {
        return await requestProcessor(req, rsp)
      } catch (error) {
        const rspError = errorToHttp(error)
        rsp.status(rspError.status).json(rspError.body)
        console.log(error)
      };
    }
  }

  function getToken(req) {
    const BEARER_STR = "Bearer "
    const tokenHeader = req.get("Authorization")
    if (!(tokenHeader && tokenHeader.startsWith(BEARER_STR) && tokenHeader.length > BEARER_STR.length)) {
      return null
    }
    req.token = tokenHeader.split(" ")[1]
    return req.token
  }
}


