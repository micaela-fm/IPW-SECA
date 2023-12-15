import crypto from 'node:crypto'
import errors from '../common/errors.mjs'
import USERS from './seca-data-mem.mjs' // temp to avoid error
import GROUPS from './seca-data-mem.mjs' // temp to avoid error

let nextUserId = USERS.length >= 1 ? USERS[USERS.length - 1].id + 1 : 1

let nextGroupId = GROUPS.length >= 1 ? GROUPS[GROUPS.length - 1].id + 1 : 1

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
        
    }
    
    async function getUserId(userToken) {
        
    }
    
    async function getAllGroups(userId) {
        
    }
    
    async function getGroup(groupId) {
        
    }
    
    async function createGroup(newGroup) {
        
    }
    
    async function editGroup(group) {
        
    }
    
    async function deleteGroup(groupId) {
        
    }
    
    async function addEventToGroup(groupId, event) {
        
    }
    
    async function deleteEventFromGroup(groupId, eventId) {
        
    }
}


