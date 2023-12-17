import crypto from 'node:crypto'
import errors from '../common/errors.mjs'

export let USERS = [
    {
        id: 1,
        name: "Noemi Ferreira",
        token: "3eac1b5d-1386-4ecd-a831-656c75c410f0"
    },
    {
        id: 2,
        name: "Micaela Macatrão",
        token: "036558db-f4a8-4df0-92f0-a02bb83dd473"
    },
    {
        id: 3,
        name: "Tiago Névoa",
        token: "34e4953f-40d0-456c-8fcf-1db2ea51c9f4"
    }
]

export let GROUPS = [
    {
        id: 1,
        name: "Best events ever",
        description: "user1 These are the best events ever",
        userId: 1,
        events: [
            {
                "id": "G5v0Z9YcKe8Bi",
                "name": "Phoenix Suns vs. Orlando Magic",
                "date": "2024-01-01 at 01:00 UTC",
                "venue": {
                    "name": "Footprint Center",
                    "country": "United States Of America",
                    "city": "Phoenix"
                }
            }
        ]
    }, 
    {
        id: 2,
        name: "Best events ever",
        description: "user2 These are the best events ever",
        userId: 2,
        events: [
            {
                "id": "G5v0Z9YcKe8Bi",
                "name": "Phoenix Suns vs. Orlando Magic",
                "date": "2024-01-01 at 01:00 UTC",
                "venue": {
                    "name": "Footprint Center",
                    "country": "United States Of America",
                    "city": "Phoenix"
                }
            }
        ]
    },
    
]

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
        if(!USERS.find(u => u.name == username)) {
            const user = {
                id: nextUserId++,
                name: username,
                token: crypto.randomUUID()
            }
            USERS.push(user)
            return user
        } 
        throw errors.INVALID_ARGUMENT("username already exists")
    }
    
    async function getUserId(userToken) {
        const user = USERS.find(u => {
            return u.token == userToken
        })
        if (!user) throw errors.USER_NOT_FOUND()
        return user.id
    }

    async function getAllGroups(userId) {
        const groups = GROUPS.filter (g => g.userId == userId)
        if (!groups || groups.length < 1) {
            return []
        }
        return groups
    }
    
    async function getGroup(groupId) {
        const group = GROUPS.find (g => g.id == groupId)
        if (!group) throw errors.NOT_FOUND("Group")
        return group
    }
    
    async function createGroup(newGroup) {
        const group = {
            id: nextGroupId++,
            name: newGroup.name,
            description: newGroup.description,
            userId: newGroup.userId,
            events: []
        }
        GROUPS.push(group)
        return group
    }
    
    async function editGroup(group) {
        const groupId = group.id
        const newGROUPS = GROUPS.map( g => {
            if (g.id == groupId) {
                return group
            }
            return g
        })
        GROUPS = newGROUPS
        return GROUPS.filter(g => g.id == groupId)[0]
    }
    
    async function deleteGroup(groupId) {
        const newGROUPS = GROUPS.filter(g => {
            return g.id != groupId
        })
        GROUPS = newGROUPS
        return true
    }
    
    async function addEventToGroup(groupId, event) {
        const newGROUPS = GROUPS.map(g => {
            if (g.id == groupId) {
                g.events.push(event)
                return g
            }
            return g
        })
        GROUPS = newGROUPS
        return true
    }
    
    async function deleteEventFromGroup(groupId, eventId) {
        const event = GROUPS.filter(g => g.id == groupId)[0].events.filter(e => e.id == eventId)[0]
        if (!event || event.length < 1) throw errors.NOT_FOUND("Event")
        const oldGroup = await getGroup(groupId)
        const newEventList = oldGroup.events.filter(e => {
            e.id != eventId
        })
        const newGROUPS = GROUPS.map(g => {
            if (g.id == groupId) {
                g.events = newEventList
                return g
            }
            return g
        })
        GROUPS = newGROUPS
        return true
    }
}


