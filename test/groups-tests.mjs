import { assert } from 'chai'
import { ERROR_CODES } from '../common/errors.mjs'
import * as secaGroupsServices from "../services/seca-groups-services.mjs"

const userToken = '3eac1b5d-1386-4ecd-a831-656c75c410f0'

describe('Seca Groups Services', function() {
    describe('#getAllGroups()', function() {
      it('should return all groups from a given user', async function() {
        const groups = await secaGroupsServices.getAllGroups(userToken)
        assert.isArray(groups)
        assert.isTrue(groups.every(group => group.userId === 1))
        assert.equal(groups.length, 1)
      })

      it('should not return any group for a user with no groups', async function() {
        const token = "34e4953f-40d0-456c-8fcf-1db2ea51c9f4"
        try {
            await secaGroupsServices.getAllGroups(token)
            assert.fail('Expected error was not thrown')
        } catch (error) {
            assert.equal(error.code, ERROR_CODES.NOT_FOUND)
        }
      })
    })

    describe('#getGroup()', function() {
        it('should return details of a group from a given user', async function() {
            const groupId = 1
            const groupDetails = await secaGroupsServices.getGroup(groupId, userToken)
            assert.isObject(groupDetails)
            assert.isTrue(Number(groupDetails.id) === 1)
            assert.isTrue(Number(groupDetails.userId) === 1)
        })
        it('should not return details of a non existing group', async function() {
            const groupId = 2
            try {
                await secaGroupsServices.getGroup(groupId, userToken)
                assert.fail('Expected error was not thrown')
            } catch (error) {
                assert.equal(error.code, ERROR_CODES.NOT_FOUND)
            }
        })
        it('should not return details of a group not belonging to the given user', async function() {
            const groupId = 1
            const token = "036558db-f4a8-4df0-92f0-a02bb83dd473"
            try {
                await secaGroupsServices.getGroup(groupId, token)
                assert.fail('Expected error was not thrown')
            } catch (error) {
                assert.equal(error.code, ERROR_CODES.NOT_AUTHORIZED)
            }
        })
    })

    describe('#createGroup()', function() {
        it('should return details of the group created', async function() {
            const newGroup = {
                "name": "New Group",
                "description": "This is a new group",
            }
            const group = await secaGroupsServices.createGroup(newGroup, userToken)
            assert.isObject(group)
            assert.isTrue(group.id === 2)
            const groups = await secaGroupsServices.getAllGroups(userToken)
            assert.equal(groups.length, 2)

        })
    })

    describe('#editGroup()', function() {
        it('should change the details of a given group', async function() {
            const groupId = 2
            const newDetails = {
                "name": "New Group Restyled",
                "description": "This is a restyled group"
            }
            const group = await secaGroupsServices.editGroup(groupId, newDetails, userToken)
            assert.isObject(group)
            assert.isTrue(group.id === 2)
            assert.isTrue(group.name === newDetails.name)
            assert.isTrue(group.description === newDetails.description)

        })
    })

    describe('#addEventToGroup()', function() {
        it('should add an event to a given group', async function() {
            const groupId = 1
            const eventId = "vvG1fZ9gDIl0oI"
            const add = await secaGroupsServices.addEventToGroup(groupId, eventId, userToken)
            assert.isTrue(add)
            const groupDetails = await secaGroupsServices.getGroup(groupId, userToken)
            const event = {
                "id": "vvG1fZ9gDIl0oI",
                "name": "The Taylor Party: Taylor Swift Night",
                "date": "2024-01-20T02:00:00Z",
                "venue": {
                  "name": "The Vogue",
                  "country": "United States Of America",
                  "city": "Indianapolis"
                }
            }
            assert.isTrue(groupDetails.events.filter(e => e.id === event.id).length>0)

        })
    })

    describe('#deleteEventFromGroup()', function() {
        it('should delete an event from a given group', async function() {
            const groupId = 1
            const eventId = "G5v0Z9YcKe8Bi"
            const deleted = await secaGroupsServices.deleteEventFromGroup(groupId, eventId, userToken)
            assert.isTrue(deleted)
            const groupDetails = await secaGroupsServices.getGroup(groupId, userToken)
            assert.isTrue(groupDetails.events.length === 0)
        })

        it('should not delete a non existing event from a given group', async function() {
            const groupId = 1
            const eventId = "Z698xZ2qZaFHl"
            try {
                await secaGroupsServices.deleteEventFromGroup(groupId, eventId, userToken)
                assert.fail('Expected error was not thrown')
            } catch (error) {
                assert.equal(error.code, ERROR_CODES.NOT_FOUND)
            }
        })
    })

    describe('#deleteGroup()', function() {
        it('should delete a given group from a given user', async function() {
            const groupId = 1
            const deleted = await secaGroupsServices.deleteGroup(groupId, userToken)
            assert.isTrue(deleted)
            try {
                await secaGroupsServices.getGroup(groupId, userToken)
                assert.fail('Expected error was not thrown')
            } catch (error) {
                assert.equal(error.code, ERROR_CODES.NOT_FOUND)
            }
        })

        it('should not delete a non existing group from a given user', async function() {
            const groupId = 3
            try {
                await secaGroupsServices.deleteGroup(groupId, userToken)
                assert.fail('Expected error was not thrown')
            } catch (error) {
                assert.equal(error.code, ERROR_CODES.NOT_FOUND)
            }
        })
    })
  
})

