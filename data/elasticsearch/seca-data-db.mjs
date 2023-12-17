import crypto from 'node:crypto'
import errors from '../../common/errors.mjs'
import * as fetchWrapper from './fetch-wrapper.mjs'
import uriManager from './uri-manager.mjs'

export default function () {
    const userUriManager = uriManager('users')
    const groupUriManager = uriManager('groups')
    
    return {
        insertUser,
        getUserId,
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

    async function getUserId(userToken) {
        const uri = userUriManager.getAll() 
        const body = {
            query: {
                match: { token: userToken }
            }
        }
        const result = await fetchWrapper.post(uri, body)

        if (result.hits.total.value === 0) {
            throw errors.USER_NOT_FOUND()
        }

        return result.hits.hits[0]._source.id
    }

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

        return result.hits.hits.map(hit => hit._source)
    }

    // TODO
    async function getGroup(groupId) {
        const uri = groupUriManager.get(groupId) 
        const result = await fetchWrapper.get(uri) 

        if (!result.found) {
            throw errors.NOT_FOUND("Group")
        }

        return result._source
    }

    // TODO
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

    // TODO
    async function editGroup(groupId, group) {
        await client.update({
            index: 'groups',
            id: groupId,
            body: {
                doc: group
            },
            refresh: true
        });

        console.log(`Group with ID ${groupId} updated successfully.`);
    }

    // TODO
    async function deleteGroup(groupId) {
        const response = await client.delete({
            index: 'groups',
            id: groupId,
            refresh: true
        });

        console.log(`Group with ID ${groupId} deleted successfully.`);

        return response.body.result;
    }

    async function addEventToGroup(groupId, event) {
        // Implement this function
    }

    async function deleteEventFromGroup(groupId, eventId) {
        // Implement this function
    }

    // TODO
    async function getUser(username) {
        const result = await client.search({
            index: 'users',
            body: {
                _source: ["id"],
                query: { match: { username: username } }
            }
        });
		console.log('result.body.hits.total.value: ', result.body.hits.total.value); // Debugging line
        if (result.body.hits.total.value === 0) {
            return null;
        }

        return result.body.hits.hits[0]._source.id;
    }
}
