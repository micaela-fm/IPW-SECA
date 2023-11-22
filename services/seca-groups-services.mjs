import * as usersServices from './seca-users-services.mjs'
import * as tmData from '../data/tm-events-data.mjs'

export async function getAllGroups(userToken) {
    const userId = usersServices.getUserId(userToken)
    return tmData.getAllGroups(userId)
}

export async function getGroup(groupId, userToken) {
    const userId = usersServices.getUserId(userToken)
    return _getGroup(groupId, userId)
}

export async function createGroup(newGroup, userToken) {
    const userId = usersServices.getUserId(userToken)
    const group = {
        title: newGroup.title,
        description: newGroup.description,
        userId: userId
        // Ver se temos de adicionar um array de objetos para os eventos
    }
    return tmData.createGroup(group)
}

export async function editGroup(groupId, newGroup, userToken) {
    const userId = usersServices.getUserId(userToken)
    const group = _getGroup(groupId, userId)
    group.title = newGroup.title
    group.description = newGroup.description
    // Ver se temos de adicionar um array de objetos para os eventos
    tmData.editGroup(group)
}

export async function deleteGroup(groupId, userToken) {
    const userId = usersServices.getUserId(userToken)
    // Get the group to check if the user userId is its owner
    const group = _getGroup(groupId, userId) 
    tmData.deleteGroup(groupId)
}

export async function addEventToGroup(groupId, userToken) {
    const userId = usersServices.getUserId(userToken)
    // TODO
    tmData.addEventToGroup(groupId)
}

export async function deleteEventFromGroup(groupId, eventId, userToken) {
    const userId = usersServices.getUserId(userToken)
    // TODO
    tmData.deleteEventFromGroup(groupId, eventId)
}

async function _getGroup(groupId, userId) {
    const group = await tmData.getGroup(groupId)
    if(group.userId == userId)
        return group
    throw `Group with id ${groupId} does not belong to user ${userId}`
}


