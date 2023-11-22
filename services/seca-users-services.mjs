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

let nextId = USERS.length+1


export function insertUser(username) {
    if(!USERS.find(u => u.name == username)) {
        const user = {
            id: nextId++,
            name: username,
            token: crypto.randomUUID()
        }

        USERS.push(user)
        return true
    } 

    return false
}


export function getUserId(userToken) {
    console.log(userToken)
    const user = USERS.find(u => {
        console.log(u.token)
        return u.token == userToken
    })
    console.log("user:" , user)
    if(user) {
        return user.id
    }
}