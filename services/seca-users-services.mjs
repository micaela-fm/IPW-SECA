import errors from '../common/errors.mjs'

export default function (secaData) {
    if (!secaData) throw errors.INVALID_ARGUMENT("secaData")

    return {
        insertUser,
        getUserId, 
        validateCredentials
    }

    async function insertUser(username, password) {
        if (!username) throw errors.INVALID_ARGUMENT("username")
        if (!password) throw errors.INVALID_ARGUMENT("password")
        return await secaData.insertUser(username, password)
    }
    
    
    async function getUserId(username) {
        if (!username) throw errors.INVALID_ARGUMENT("username")
        const user = await secaData.getUserByUsername(username)
        return user[0].id
    }

    async function validateCredentials(username, password) {
        if (!username) throw errors.INVALID_ARGUMENT("username")
        if (!password) throw errors.INVALID_ARGUMENT("password")
        return await secaData.validateCredentials(username, password)
    }
}



