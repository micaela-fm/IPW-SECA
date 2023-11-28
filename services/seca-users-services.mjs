import * as secaData from '../data/seca-data-mem.mjs'

export async function insertUser(username) {
    if (!username) throw `Invalid username`
    return secaData.insertUser(username)
}


export async function getUserId(userToken) {
    if (!userToken) throw `Invalid user token`
    return secaData.getUserId(userToken)
}

