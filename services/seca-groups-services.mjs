import * as usersServices from './seca-users-services.mjs'
import * as tmData from '../data/tm-events-data.mjs'
// import * as secaData from '../data/seca-data-mem.mjs'
import errors from '../common/errors.mjs'

let secaData = null

export default function (data) {
    secaData = data

    return {
        getAllGroups,
        getGroup,
        createGroup,
        editGroup,
        deleteGroup,
        addEventToGroup,
        deleteEventFromGroup
    }
}

async function getAllGroups(userToken) {
    if (!userToken) throw errors.INVALID_ARGUMENT("token")
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND()
    return secaData.getAllGroups(userId)
}

async function getGroup(groupId, userToken) {
    if (!userToken) throw errors.INVALID_ARGUMENT("token")
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND()
    return _getGroup(groupId, userId)
}

async function createGroup(newGroup, userToken) {
    newGroup = await validateGroupParameters(newGroup)
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND()
    newGroup.userId = userId
    return secaData.createGroup(newGroup)
}

async function editGroup(groupId, newGroup, userToken) {
    newGroup = await validateGroupParameters(newGroup)
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND()
    let group = await _getGroup(groupId, userId)
    if (!group) throw errors.NOT_FOUND("Group")
    group.name = newGroup.name
    group.description = newGroup.description
    return secaData.editGroup(group)
}

async function deleteGroup(groupId, userToken) {
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND()
    const group = await _getGroup(groupId, userId) 
    if (!group) throw errors.NOT_FOUND("Group")
    return secaData.deleteGroup(groupId)
}

async function addEventToGroup(groupId, eventId, userToken) {
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND()
    const group = await _getGroup(groupId, userId)
    if (!group) throw errors.NOT_FOUND("Group")
    const event = await tmData.getEventById(eventId)
    if (!event) throw errors.NOT_FOUND("Event")
    return secaData.addEventToGroup(groupId, event)
}

async function deleteEventFromGroup(groupId, eventId, userToken) {
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND()
    const group = await _getGroup(groupId, userId)
    if (!group) throw errors.NOT_FOUND("Group")
    return secaData.deleteEventFromGroup(groupId, eventId)
}

async function _getGroup(groupId, userId) {
    const group = await secaData.getGroup(groupId)
    if(group.userId == userId)
        return group
    throw errors.NOT_AUTHORIZED(`User ${userId}`, `group ${groupId}`)
}

async function validateGroupParameters(group) {
    if(!group.name) throw errors.INVALID_ARGUMENT("group name")
    if(!group.description) throw errors.INVALID_ARGUMENT("group description")
    return group
}

