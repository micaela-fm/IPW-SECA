import { assert } from 'chai'
import { ERROR_CODES } from '../common/errors.mjs'
import * as secaUsersServices from "../services/seca-users-services.mjs"

const userToken = '3eac1b5d-1386-4ecd-a831-656c75c410f0'

describe('Seca Users Services', function() {
    describe('#insertUser()', function() {
      it('should return token for the new user', async function() {
        const username = "Prof"
        const addUser = await secaUsersServices.insertUser(username)
        assert.isString(addUser)
        assert.isTrue(addUser.length === userToken.length)
      })
    })

    describe('#getUserId()', function() {
        it('should return user ID for the given token', async function() {
          const user = await secaUsersServices.getUserId(userToken)
          assert.isNumber(user)
          assert.isTrue(user === 1)
        })

        it('should not return any user ID for non existing token', async function() {
            const token = '3eac1b4d-1386-4ecd-a830-656c75c410f1'
            try {
                await secaUsersServices.getUserId(token)
                assert.fail('Expected error was not thrown')
            } catch (error) {
                assert.equal(error.code, ERROR_CODES.USER_NOT_FOUND)
            }
          })
      })
})

