import { assert } from 'chai'
import * as secaEventsServices from "../services/seca-events-services.mjs"

describe('Seca Events Services', function() {
  describe('#getPopularEvents()', function() {
    it('Mock data: should return popular events', async function() {
      const size = 3
      const page = 1
      secaEventsServices.setTest(true)
      const events = await secaEventsServices.getPopularEvents(size, page)
      assert.isArray(events)
      assert.equal(events.length, size)
      secaEventsServices.setTest(false)
    })
  })

  describe('#searchEventsByName()', function() {
    it('Mock data: should return events that match the search query', async function() {  
      const keyword = "Mock"
      const size = 2
      const page = 1
      secaEventsServices.setTest(true)
      const events = await secaEventsServices.getEventsByName(keyword, size, page)
      assert.isArray(events)
      assert.equal(events.length, size)
      secaEventsServices.setTest(false)
    })
  })

  describe('#getPopularEvents()', function() {
    it('Real data: should return popular events', async function() {
      const size = undefined // this will be replaced by 30 in the validateParameters function
      const page = 1
      const events = await secaEventsServices.getPopularEvents(size, page)
      assert.isArray(events)
      assert.equal(events.length, 30)
    })
  })

  describe('#searchEventsByName()', function() {
    it('Real data: should return events that match the search query', async function() {  
      const keyword = "Taylor Swift"
      const size = 10
      const page = 1
      const events = await secaEventsServices.getEventsByName(keyword, size, page)
      assert.isArray(events)
      assert.equal(events.length, size)
    })
  })
})

