// implementation of the HTTP routes that make up the REST API of the web application

// Dependencies
import errorToHttp from './errors-to-http-responses.mjs'
import * as secaServices from "../services/seca-groups-services.mjs"

export const createGroup = processRequest(_createGroup, true)
export const editGroup = processRequest(_editGroup, true)
export const listGroups = processRequest(_listAllGroups, true)
export const deleteGroup = processRequest(_deleteGroup, true)
export const getGroupDetails = processRequest(_getGroupDetails, true)
export const addEvent = processRequest(_addEventToGroup, true)
export const removeEvent = processRequest(_removeEvent, true)

// Create group providing its name and description
async function _createGroup(req, rsp) {
  const newGroup = {
    name: req.body.name,
    description: req.body.description,
    events: req.body.events,
  }

  const group = await secaServices.createGroup(newGroup, req.token)
  rsp.status(201).json(group)
}

// Edit group by changing its name and description
async function _editGroup(req, rsp) {
  const groupId = req.params.id
  const newGroup = {
    name: req.body.name,
    description: req.body.description
  }

  const group = await secaServices.editGroup(groupId, newGroup, req.token)
  rsp.json(group)
}

// List all groups
async function _listAllGroups(req, rsp) {
  const groups = await secaServices.getAllGroups(req.token)
  rsp.json(groups)
} 

// Delete a group
async function _deleteGroup(req, rsp) {
  const groupId = req.params.id
  const group = await secaServices.deleteGroup(groupId, req.token)
  rsp.json(`Group ${groupId} deleted`)
}

// Get the details of a group
async function _getGroupDetails(req, rsp) {
  const groupId = req.params.id
  const group = await secaServices.getGroup(groupId, req.token)
  if(group)
    return rsp.json(group)
  rsp.status(404).json("Group not found")
}

// Add a event to a group
// verificar quando secaServices.addEventToGroup estiver terminada
async function _addEventToGroup(req, rsp) {
  const groupId = req.params.id
  const eventId = req.params.eventId
  const event = await secaServices.addEventToGroup(groupId, eventId, req.token)
  rsp.json(`Event ${eventId} added to group ${groupId}`)
}

// Remove an event from a group
// verificar quando secaServices estiver terminada
async function _removeEvent(req, rsp) {
  const groupId = req.params.id
  const eventId = req.params.eventId
  const event = await secaServices.deleteEventFromGroup(groupId, eventId, req.token)
  rsp.json(`Event ${eventId} removed from group ${groupId}`)
}


// Auxiliary functions
export function processRequest(requestProcessor, requiresAuthentication) {
  return async function(req, rsp) {
    if (requiresAuthentication) {
      const token = getToken(req);
      if (!token) {
        rsp
          .status(401)
          .json({error: `Invalid authentication token`})
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
  if(!(tokenHeader && tokenHeader.startsWith(BEARER_STR) && tokenHeader.length > BEARER_STR.length)) {
      return null
  }
  req.token = tokenHeader.split(" ")[1]
  return req.token
}
