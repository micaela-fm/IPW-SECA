// import * as secaData from '../data/seca-data-mem.mjs'
import errors from '../common/errors.mjs'

export default function (secaData) {
    if (!secaData) throw errors.INVALID_ARGUMENT("secaData")

    return {
        insertUser,
        getUserId
    }

    async function insertUser(username, password) {
        if (!username) throw errors.INVALID_ARGUMENT("username")
        if (!password) throw errors.INVALID_ARGUMENT("password")
        return await secaData.insertUser(username, password)
    }
    
    
    async function getUserId(userToken) {
        if (!userToken) throw errors.INVALID_ARGUMENT("token")
        const user = await secaData.getUserByToken(userToken)
        // console.log(user[0].id)
        return user[0].id
    }
}



