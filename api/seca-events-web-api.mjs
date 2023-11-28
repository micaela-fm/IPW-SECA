// Dependencies
import * as secaServices from "../services/seca-events-services.mjs"
import { processRequest } from "./seca-groups-web-api.mjs"

export const popularEvents = processRequest(getPopularEvents, false)
export const searchEvents = processRequest(searchEventsByName, false)

// Get the list of the most popular events
async function getPopularEvents(req, rsp) {
    const size = req.query.size
    const page = req.query.page 
    const events = await secaServices.getPopularEvents(size, page)
    return rsp.json(events)
  }
  
  // Search events by name
  async function searchEventsByName(req, rsp) {
      const keyword = req.params.name
      const size = req.query.size
      const page = req.query.page
      const events = await secaServices.getEventsByName(keyword, size, page)
      return rsp.json(events)
  }
  

