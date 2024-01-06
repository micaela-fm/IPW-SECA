import crypto from 'node:crypto'
import errors from '../../common/errors.mjs'
import * as fetchWrapper from './fetch-wrapper.mjs'
import uriManager from './uri-manager.mjs'

export default async function () {
    const userUriManager = await uriManager('users')
    const groupUriManager = await uriManager('groups')
    const eventUriManager = await uriManager('events')
    
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
    
        const uri = userUriManager.create()
        const response = fetchWrapper.post(uri, user)
    
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
    //     const result = await fetchWrapper.post(uri, body)

    //     if (result.hits.total.value === 0) {
    //         throw errors.USER_NOT_FOUND()
    //     }

    //     return result.hits.hits[0]._source.id // need to fix this line
    // }

    async function getAllGroups(userId) {
        const uri = groupUriManager.getAll()
        const body = {
            query: {
                match: { userId: userId }
            }
        }
        const result = await fetchWrapper.post(uri, body) 

        if (result.hits.total.value === 0) {
            return []
        }

        return result.hits.hits.map(hit => ({
            id: hit._id, 
            ...hit._source
        }))
    }

    async function getGroup(groupId) {
        const uri = groupUriManager.get(groupId) 
        const result = await fetchWrapper.get(uri) 

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
        const uri = groupUriManager.create()
        const response = await fetchWrapper.post(uri, group)
        group.id = response._id
        return group
    }

    async function editGroup(group) {
        const uri = groupUriManager.update(group.id)
        await fetchWrapper.post(uri, group)
        console.log(`Group with ID ${group.id} updated successfully.`)

        const getUri = groupUriManager.get(group.id)
        const result = await fetchWrapper.get(getUri)

        if (!result.found) {
            throw errors.NOT_FOUND("Group")
        }

        return {
            id: group.id, 
            ...result._source
        }
    }

    async function deleteGroup(groupId) {
        const uri = groupUriManager.delete(groupId)
        await fetchWrapper.del(uri)
        console.log(`Group with ID ${groupId} deleted successfully.`);
        
        return true
    }

    async function addEventToGroup(groupId, event) {
        const uri = groupUriManager.get(groupId)

        const result = await fetchWrapper.get(uri);
        if (!result.found) {
            throw errors.NOT_FOUND("Group")
        }

        const updatedGroup = {
            id: groupId, 
            ...result._source,
            events: [...result._source.events, event]
        }

        await fetchWrapper.post(uri, updatedGroup)
        console.log(`Event added to group with ID ${groupId} successfully.`);
        return updatedGroup
    }

    async function deleteEventFromGroup(groupId, eventId) {
        const uri = groupUriManager.get(groupId)
        const result = await fetchWrapper.get(uri)
        
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

        await fetchWrapper.post(uri, updatedGroup)
        console.log(`Event with ID ${eventId} deleted from group with ID ${groupId} successfully.`)
        return updatedGroup
    }

    async function getUser(propName, value) {
        const uri = `${uriManager.getAll()}?q=${propName}:${value}`
        return get(uri)
            .then(body => body.hits.hits.map(createUserFromElastic))
    }

    async function getUserByToken(userToken) {
        return getUser("token", userToken)
    } 

    async function getUserByUsername(username) {
        return getUser("username", username)
    } 

    function createUserFromElastic(userElastic) {
        let user = Object.assign({id: userElastic._id}, userElastic._source)
        return user
    }
}
