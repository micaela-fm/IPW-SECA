import crypto from 'node:crypto'
import { Client } from '@elastic/elasticsearch'
import * as fetchWrapper from './fetch-wrapper.mjs'
import uriManager from './uri-manager.mjs'

const client = new Client({ node: process.env.ELASTICSEARCH_NODE || 'http://localhost:9200' })

export default function () {
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
    
        const userUriManager = await uriManager('users')
        const uri = userUriManager.create()
        const response = fetchWrapper.post(uri, user)
    
        user.id = response._id
    
        return user
    }

    async function getUserId(userToken) {
        const result = await client.search({
            index: 'users_index',
            body: {
                _source: ["id"],
                query: { match: { token: userToken } }
            }
        });

		console.log('Result: ', result.body); // Debugging line

        if (result.body.hits.total.value === 0) {
            throw new Error('User not found.')
        }
		console.log("Elasticsearch search result:", result); // Debugging line
        return result.body.hits.hits[0]._source.id
    }

    async function getAllGroups(userId) {
        const result = await client.search({
            index: 'groups_index',
            body: {
                _source: ["id"],
                query: { match: { members: userId } }
            }
        });

        if (result.body.hits.total.value === 0) {
            return [];
        }

        return result.body.hits.hits.map(hit => hit._source.id);
    }

    async function getGroup(groupId) {
        const result = await client.get({
            index: 'groups_index',
            id: groupId,
            _source: ["name", "description", "members"]
        });

        if (!result.body.found) {
            throw new Error('Group not found.')
        }

        return result.body._source;
    }

    async function createGroup(newGroup) {
        const response = await client.index({
            index: 'groups_index',
            body: newGroup,
            refresh: true
        });

        console.log(`Group added successfully with ID ${response.body._id}.`);

        return response.body._id;
    }

    async function editGroup(groupId, group) {
        await client.update({
            index: 'groups_index',
            id: groupId,
            body: {
                doc: group
            },
            refresh: true
        });

        console.log(`Group with ID ${groupId} updated successfully.`);
    }

    async function deleteGroup(groupId) {
        const response = await client.delete({
            index: 'groups_index',
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

    async function getUser(username) {
        const result = await client.search({
            index: 'users_index',
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

    async function addUser(user) {
        const response = await client.index({
            index: 'users_index',
            body: user,
            refresh: true
        });

        return response.body
    }
}
