import * as tmData from '../data/tm-events-data.mjs'
import errors from '../common/errors.mjs'

export default function (usersServices, secaData) {
    if (!secaData) throw errors.INVALID_ARGUMENT("secaData")
    if (!usersServices) throw errors.INVALID_ARGUMENT("usersServices")

    return {
        getAllGroups,
        getGroup,
        createGroup,
        editGroup,
        deleteGroup,
        addEventToGroup,
        deleteEventFromGroup
    }

    async function getAllGroups(username) {
        if (!username) throw errors.INVALID_ARGUMENT("username")
        const userId = await usersServices.getUserId(username)
        if (!userId) throw errors.USER_NOT_FOUND()
        return await secaData.getAllGroups(userId)
    }
    
    async function getGroup(groupId, username) {
        if (!username) throw errors.INVALID_ARGUMENT("username")
        const userId = await usersServices.getUserId(username)
        if (!userId) throw errors.USER_NOT_FOUND()
        return _getGroup(groupId, userId)
    }
    
    async function createGroup(newGroup, username) {
        newGroup = await validateGroupParameters(newGroup)
        const userId = await usersServices.getUserId(username)
        if (!userId) throw errors.USER_NOT_FOUND()
        newGroup.userId = userId
        return await secaData.createGroup(newGroup)
    }
    
    async function editGroup(groupId, newGroup, username) {
        newGroup = await validateGroupParameters(newGroup)
        const userId = await usersServices.getUserId(username)
        if (!userId) throw errors.USER_NOT_FOUND()
        let group = await _getGroup(groupId, userId)
        if (!group) throw errors.NOT_FOUND("Group")
        group.name = newGroup.name
        group.description = newGroup.description
        return await secaData.editGroup(group)
    }
    
    async function deleteGroup(groupId, username) {
        const userId = await usersServices.getUserId(username)
        if (!userId) throw errors.USER_NOT_FOUND()
        const group = await _getGroup(groupId, userId) 
        if (!group) throw errors.NOT_FOUND("Group")
        return await secaData.deleteGroup(groupId)
    }
    
    async function addEventToGroup(groupId, eventId, username) {
        const userId = await usersServices.getUserId(username)
        if (!userId) throw errors.USER_NOT_FOUND()
        const group = await _getGroup(groupId, userId)
        if (!group) throw errors.NOT_FOUND("Group")
        const event = await tmData.getEventById(eventId)
        if (!event) throw errors.NOT_FOUND("Event")
        return await secaData.addEventToGroup(groupId, event)
    }
    
    async function deleteEventFromGroup(groupId, eventId, username) {
        const userId = await usersServices.getUserId(username)
        if (!userId) throw errors.USER_NOT_FOUND()
        const group = await _getGroup(groupId, userId)
        if (!group) throw errors.NOT_FOUND("Group")
        return await secaData.deleteEventFromGroup(groupId, eventId)
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
}



