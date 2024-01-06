import crypto from 'node:crypto'
import errors from '../../common/errors.mjs'
import {USERS, GROUPS} from '../memory/seca-data-mem.mjs'
import {get, post, del, put} from './fetch-wrapper.mjs'
import uriManager from './uri-manager.mjs'

export default async function () {
    const userUriManager = await uriManager('users')
    const groupUriManager = await uriManager('groups')
    //const eventUriManager = await uriManager('events')

    // Put some default data into ES upon app init
    await put(userUriManager.update(USERS[0].id), USERS[0])
    await put(userUriManager.update(USERS[1].id), USERS[1])
    await put(userUriManager.update(USERS[2].id), USERS[2])
    await put(groupUriManager.update(GROUPS[0].id), GROUPS[0])
    await put(groupUriManager.update(GROUPS[1].id), GROUPS[1])
    
    return {
        insertUser,
        getUserByToken,
        getUserByUsername,
        getAllGroups,
        getGroup,
        createGroup,
        editGroup,
        deleteGroup,
        addEventToGroup,
        deleteEventFromGroup
    }

    async function insertUser(username) {
        const user = {
            name: username,
            token: crypto.randomUUID()
        }
    
        const response = await post(userUriManager.create(), user)
    
        user.id = response._id
    
        return user
    }

    // // TO DO TO DO TO DO TO DO TO DO TO DO TO DO 
    // async function getUserId(userToken) {
    //     const uri = userUriManager.getAll() 
    //     const body = {
    //         query: {
    //             match: { token: userToken }
    //         }
    //     }
    //     const result = await post(uri, body)

    //     if (result.hits.total.value === 0) {
    //         throw errors.USER_NOT_FOUND()
    //     }

    //     return result.hits.hits[0]._source.id // need to fix this line
    // }

    async function getAllGroups(userId) {
        const query = {
            query: {
                match: { "userId": userId }
            }
        }
        return await post(groupUriManager.getAll(), query)
            .then(body => body.hits.hits.map(createGroupFromElastic))
    }

    async function getGroup(groupId) {
        const result = await get(groupUriManager.get(groupId))

        if (!result.found) {
            throw errors.NOT_FOUND("Group")
        }

        return { 
            id: groupId,
            ...result._source
        }
    }

    async function createGroup(newGroup) {
        const group = {
            name: newGroup.name, 
            description: newGroup.description, 
            userId: newGroup.userId, 
            events: []
        }
        const response = await post(groupUriManager.create(), group)
        group.id = response._id
        return group
    }

    async function editGroup(group) {
        await put(groupUriManager.update(group.id), group)
        console.log(`Group with ID ${group.id} updated successfully.`)

        const result = await get(groupUriManager.get(group.id))

        if (!result.found) {
            throw errors.NOT_FOUND("Group")
        }

        return {
            id: group.id, 
            ...result._source
        }
    }

    async function deleteGroup(groupId) {
        await del(groupUriManager.delete(groupId))
        console.log(`Group with ID ${groupId} deleted successfully.`);
        
        return true
    }

    async function addEventToGroup(groupId, event) {
        const uri = groupUriManager.get(groupId)

        const result = await get(uri);
        if (!result.found) {
            throw errors.NOT_FOUND("Group")
        }

        const updatedGroup = {
            id: groupId, 
            ...result._source,
            events: [...result._source.events, event]
        }

        await post(uri, updatedGroup)
        console.log(`Event added to group with ID ${groupId} successfully.`);
        return updatedGroup
    }

    async function deleteEventFromGroup(groupId, eventId) {
        const uri = groupUriManager.get(groupId)
        const result = await get(uri)
        
        if (!result.found) {
            throw errors.NOT_FOUND("Group")
        }

        const updatedEvents = result._source.events.filter(e => e.id !== eventId)

        if (updatedEvents.length === result._source.events.length) {
            throw errors.NOT_FOUND("Event")
        }

        const updatedGroup = {
            id: groupId,
            ...result._source,
            events: updatedEvents
        }

        await post(uri, updatedGroup)
        console.log(`Event with ID ${eventId} deleted from group with ID ${groupId} successfully.`)
        return updatedGroup
    }

    async function getUser(propName, value) {
        const uri = `${userUriManager.getAll()}?q=${propName}:${value}`
        return await get(uri)
            .then(body => body.hits.hits.map(createUserFromElastic))
    }

    async function getUserByToken(userToken) {
        return getUser("token", userToken)
    } 

    async function getUserByUsername(username) {
        return getUser("name", username)
    } 

    function createUserFromElastic(userElastic) {
        let user = Object.assign({id: userElastic._id}, userElastic._source)
        return user
    }

    function createGroupFromElastic(groupElastic) {
        let group = Object.assign({id: groupElastic._id}, groupElastic._source)
        return group
    }
}
