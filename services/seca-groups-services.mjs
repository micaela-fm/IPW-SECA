import * as usersServices from './seca-users-services.mjs'
import * as tmData from '../data/tm-events-data.mjs'
import * as secaData from '../data/seca-data-mem.mjs'
import errors from '../common/errors.mjs'

export async function getAllGroups(userToken) {
    if (!userToken) throw errors.INVALID_ARGUMENT("token")
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND
    return secaData.getAllGroups(userId)
}

export async function getGroup(groupId, userToken) {
    if (!userToken) throw errors.INVALID_ARGUMENT("token")
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND
    return _getGroup(groupId, userId)
}

export async function createGroup(newGroup, userToken) {
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND
    newGroup.userId = userId
    return secaData.createGroup(newGroup)
}

export async function editGroup(groupId, newGroup, userToken) {
    if (!newGroup.name) throw errors.INVALID_ARGUMENT("group name")
    if (!newGroup.description) throw errors.INVALID_ARGUMENT("group description")
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND
    let group = await _getGroup(groupId, userId)
    if (!group) throw errors.NOT_FOUND("Group")
    group.name = newGroup.name
    group.description = newGroup.description
    return secaData.editGroup(group)
}

export async function deleteGroup(groupId, userToken) {
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND
    const group = await _getGroup(groupId, userId) 
    if (!group) throw errors.NOT_FOUND("Group")
    return secaData.deleteGroup(groupId)
}

export async function addEventToGroup(groupId, eventId, userToken) {
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND
    const group = await _getGroup(groupId, userId)
    if (!group) throw errors.NOT_FOUND("Group")
    const event = await tmData.getEventById(eventId)
    if (!event) throw errors.NOT_FOUND("Event")
    return secaData.addEventToGroup(groupId, event)
}

export async function deleteEventFromGroup(groupId, eventId, userToken) {
    const userId = await usersServices.getUserId(userToken)
    if (!userId) throw errors.USER_NOT_FOUND
    const group = await _getGroup(groupId, userId)
    if (!group) throw errors.NOT_FOUND("Group")
    const event = await tmData.getEventById(eventId)
    if (!event) throw errors.NOT_FOUND("Event")
    return secaData.deleteEventFromGroup(groupId, eventId)
}

async function _getGroup(groupId, userId) {
    const group = await secaData.getGroup(groupId)
    if(group.userId == userId)
        return group
    throw errors.NOT_AUTHORIZED(`User ${userId}`, `group ${groupId}`)
}

