// Dependencies
import errorToHttp from '../errors-to-http-responses.mjs'
import errors from '../../common/errors.mjs'

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
    getEventDetails: processRequest(_getEventDetails, false),
    createGroup: processRequest(_createGroup, true),
    editGroupForm: processRequest(_editGroupForm, true),
    editGroup: processRequest(_editGroup, true),
    listGroups: processRequest(_listAllGroups, true),
    deleteGroup: processRequest(_deleteGroup, true),
    getGroupDetails: processRequest(_getGroupDetails, true),
    addEventForm: processRequest(_addEventForm, true),
    addEvent: processRequest(_addEventToGroup, true),
    removeEvent: processRequest(_removeEvent, true),
    createUser: processRequest(_createUser, false),
    validateCredentials
  }

  // Get the list of the most popular events
  async function _getPopularEvents(req, rsp) {
    const size = req.query.size
    const page = req.query.page
    const events = await secaEventsServices.getPopularEvents(size, page)
    rsp.render('popularEvents', { events })
  }

  // Search events by name
  async function _searchEventsByName(req, rsp) {
    const keyword = req.query.keyword
    const size = req.query.size
    const page = req.query.page
    const events = await secaEventsServices.getEventsByName(keyword, size, page)
    rsp.render('eventsByName', { events })
  }

  // Get the details of an event
  async function _getEventDetails(req, rsp) {
    const eventId = req.params.id;
    const event = await secaEventsServices.getEventsById(eventId);
    rsp.render('eventDetails', { event });
  }

  // Create group providing its name and description
  async function _createGroup(req, rsp) {
    const newGroup = {
      name: req.body.name,
      description: req.body.description
    }
    await secaGroupsServices.createGroup(newGroup, req.user.username)
    rsp.redirect('groups')
  }

  // Render the form for editing a group
  async function _editGroupForm(req, rsp) {
    const groupId = req.params.id
    const group = await secaGroupsServices.getGroup(groupId, req.user.username)
    rsp.render('editGroupForm', { group })
  }
  
  // Edit group by changing its name and description
  async function _editGroup(req, rsp) {
    const groupId = req.params.id
    const newGroup = {
      name: req.body.name,
      description: req.body.description
    }

    await secaGroupsServices.editGroup(groupId, newGroup, req.user.username)
    rsp.redirect('/seca/groups')
  }

  // List all groups
  async function _listAllGroups(req, rsp) {
    const groups = await secaGroupsServices.getAllGroups(req.user.username)
    rsp.render('listGroups', { groups })
  }

  // Delete a group
  async function _deleteGroup(req, rsp) {
    const groupId = req.params.id
    await secaGroupsServices.deleteGroup(groupId, req.user.username)
    rsp.redirect('/seca/groups')
  }

  // Get the details of a group
  async function _getGroupDetails(req, rsp) {
    const groupId = req.params.id
    const group = await secaGroupsServices.getGroup(groupId, req.user.username)
    rsp.render('groupDetails', { group })
  }

  // Add a event to a group
  async function _addEventForm(req, rsp) {
    const eventId = req.params.id
    const event = await secaEventsServices.getEventsById(eventId);
    const groups = await secaGroupsServices.getAllGroups(req.user.username)
    rsp.render('addEventForm', { event, groups })
  }

  // Add a event to a group
  async function _addEventToGroup(req, rsp) {
    const groupId = req.body.groupId
    const eventId = req.params.id
    await secaGroupsServices.addEventToGroup(groupId, eventId, req.user.username)
    rsp.redirect(`/seca/groups/${groupId}`)
  }

  // Remove an event from a group
  async function _removeEvent(req, rsp) {
    const groupId = req.params.id
    const eventId = req.params.eventId
    const event = await secaGroupsServices.deleteEventFromGroup(groupId, eventId, req.user.username)
    rsp.redirect(`/seca/groups/${groupId}`)
  }

  // Create new user, given its username
  async function _createUser(req, rsp) {    
    const userName = req.body.name
    const pwd = req.body.pwd
    const user = await secaUsersServices.insertUser(userName, pwd)
    rsp.render('createUser', {user})
  }

  async function validateCredentials(username, password) {
    return await secaUsersServices.validateCredentials(username, password)
  }


  // Auxiliary functions
  function processRequest(requestProcessor, requiresAuthentication) {
    return async function (req, rsp) {
      if (requiresAuthentication) {
        if (!req.user) {
          return rsp
            .status(401)
            .redirect("/seca/loginForm.html")
        }
      }
      try {
        return await requestProcessor(req, rsp)
      } catch (error) {
        const rspError = errorToHttp(error)
        rsp.status(rspError.status).json(rspError.body)
        console.log(error)
      }
    }
  }
}


