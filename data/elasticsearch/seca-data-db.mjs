import crypto from 'node:crypto'
import errors from '../../common/errors.mjs'
import {USERS, GROUPS} from '../memory/seca-data-mem.mjs'
import {get, post, del, put} from './fetch-wrapper.mjs'
import uriManager from './uri-manager.mjs'

export default async function () {
    const userUriManager = await uriManager('users')
    const groupUriManager = await uriManager('groups')

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
        validateCredentials,
        getAllGroups,
        getGroup,
        createGroup,
        editGroup,
        deleteGroup,
        addEventToGroup,
        deleteEventFromGroup
    }

    async function insertUser(username, password) {
        const userExists = await getUserByUsername(username)
        if (!userExists[0]) {
            const user = {
                id: crypto.randomUUID(),
                name: username,
                token: crypto.randomUUID(),
                pwd: password
            }
        
            const response = await post(userUriManager.create(), user)

            const updatedUser = {
                id: await response._id,
                name: user.name,
                token: user.token,
                pwd: user.pwd
            }

            await put(userUriManager.update(response._id), updatedUser)
        
            return updatedUser
        }
        return null
    }

    async function getUserByToken(userToken) {
        return await getUser("token", userToken)
    } 

    async function getUserByUsername(username) {
        return await getUser("name", username)
    } 

    async function getUser(propName, value) {
        const uri = `${userUriManager.getAll()}?q=${propName}:${value}`
        return await get(uri)
            .then(body => body.hits.hits.map(createUserFromElastic))
    }

    async function validateCredentials(username, password) {
        const user = await getUserByUsername(username)
        return user[0].pwd == password
    }

    async function getAllGroups(userId) {
        const response = await get(groupUriManager.getAll())
        const filtered = await response.hits.hits.filter(it => it._source.userId == userId);
        return await filtered.map(createGroupFromElastic)
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
            id: crypto.randomUUID(),
            name: newGroup.name, 
            description: newGroup.description, 
            userId: String(newGroup.userId), 
            events: []
        }
        const response = await post(groupUriManager.create(), group)
        
        const updatedGroup = {
            id: await response._id,
            name: group.name,
            description: group.description,
            userId: group.userId,
            events: group.events
        }

        await put(groupUriManager.update(response._id), updatedGroup)
        return updatedGroup
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
}

function createUserFromElastic(userElastic) {
    let user = Object.assign({id: userElastic._id}, userElastic._source)
    return user
}

function createGroupFromElastic(groupElastic) {
    let group = Object.assign({id: groupElastic._id}, groupElastic._source)
    return group
}

