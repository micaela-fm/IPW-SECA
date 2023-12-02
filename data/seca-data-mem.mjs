import crypto from 'node:crypto'

const USERS = [
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

let nextUserId = USERS.length+1

const GROUPS = [
    {
        id: 1,
        name: "Best events ever",
        description: "These are the best events ever",
        userId: 1,
        events: []
    },
    
]

let nextGroupId = GROUPS.length+1

export async function insertUser(username) {
    if(!USERS.find(u => u.name == username)) {
        const user = {
            id: nextUserId++,
            name: username,
            token: crypto.randomUUID()
        }
        USERS.push(user)
        return true
    } 
    return false
}

export async function getUserId(userToken) {
    const user = USERS.find(u => {
        return u.token == userToken
    })
    if (!user) throw `Invalid user token`
    return user.id
}

export async function getAllGroups(userId) {
    const groups = GROUPS.filter (g => g.userId == userId)
    if (!groups || groups.length < 1) throw `User has no groups`
    return groups
}

export async function getGroup(groupId) {
    const group = GROUPS.filter (g => g.id == groupId)
    if (!group) throw `Group does not exist`
    return group
}

export async function createGroup(newGroup) {
    const group = {
        id: nextGroupId++,
        name: newGroup.name,
        description: newGroup.description,
        userId: newGroup.id,
        events: []
    }
    GROUPS.push(group)
    return true
}

export async function editGroup(group) {
    // TODO
}

