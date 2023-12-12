// import * as secaData from '../data/seca-data-mem.mjs'
import errors from '../common/errors.mjs'

export default function (secaData) {
    if (!secaData) throw errors.INVALID_ARGUMENT("secaData")

    return {
        insertUser,
        getUserId
    }

    async function insertUser(username) {
        if (!username) throw errors.INVALID_ARGUMENT("username")
        return secaData.insertUser(username)
    }
    
    
    async function getUserId(userToken) {
        if (!userToken) throw errors.INVALID_ARGUMENT("token")
        return secaData.getUserId(userToken)
    }
}



