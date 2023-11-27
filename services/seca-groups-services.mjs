import * as usersServices from './seca-users-services.mjs'
import * as tmData from '../data/tm-events-data.mjs'
import * as secaData from '../data/seca-data-mem.mjs'

export async function getAllGroups(userToken) {
    const userId = await usersServices.getUserId(userToken)
    return secaData.getAllGroups(userId)
}

export async function getGroup(groupId, userToken) {
    const userId = await usersServices.getUserId(userToken)
    return _getGroup(groupId, userId)
}

export async function createGroup(newGroup, userToken) {
    const userId = await usersServices.getUserId(userToken)
    newGroup.userId = userId
    return secaData.createGroup(newGroup)
}

export async function editGroup(groupId, newGroup, userToken) {
    if (!newGroup.title) throw `Invalid parameter: title`
    if (!newGroup.description) throw `Invalid parameter: description`
    const userId = await usersServices.getUserId(userToken)
    const group = _getGroup(groupId, userId)
    group.title = newGroup.title
    group.description = newGroup.description
    return secaData.editGroup(group)
}

export async function deleteGroup(groupId, userToken) {
    const userId = await usersServices.getUserId(userToken)
    const group = _getGroup(groupId, userId) 
    return secaData.deleteGroup(groupId)
}

export async function addEventToGroup(groupId, eventId, userToken) {
    const userId = usersServices.getUserId(userToken)
    const group = _getGroup(groupId, userId)
    const event = tmData.getEventById(eventId)
    return secaData.addEventToGroup(groupId, eventId)
}

export async function deleteEventFromGroup(groupId, eventId, userToken) {
    const userId = usersServices.getUserId(userToken)
    const group = _getGroup(groupId, userId)
    const event = tmData.getEventById(eventId)
    return secaData.deleteEventFromGroup(groupId, eventId)
}

async function _getGroup(groupId, userId) {
    const group = await secaData.getGroup(groupId)
    if(group.userId == userId)
        return group
    throw `Group with id ${groupId} does not belong to user ${userId}`
}


