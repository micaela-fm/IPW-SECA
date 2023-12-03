import * as tmData from '../data/tm-events-data.mjs'
import * as mockData from '../tests/tm-events-mock.mjs'
import errors from '../common/errors.mjs'

let test = false;

export function setTest(value) {
    test = value;
}

export async function getEventsByName(keyword, s, p) {
    if(!keyword) {
        throw errors.INVALID_ARGUMENT("keyword")
    }
    const parameters = await validateParameters(s, p)
    const size = parameters.size
    const page = parameters.page
    if (test) return mockData.getEventsByName(keyword, size, page)
    return tmData.getEventsByName(keyword, size, page)
}

export async function getPopularEvents(s, p) {
    const parameters = await validateParameters(s, p)
    const size = parameters.size
    const page = parameters.page
    if (test) return mockData.getPopularEvents(size, page)
    return tmData.getPopularEvents(size, page)
}

export async function getEventsById(eventId) {
    if (!eventId) {
        throw errors.INVALID_ARGUMENT("event ID")
    }
    return tmData.getEventById(eventId)
}

async function validateParameters(s, p) {
    if(s <= 0) throw errors.INVALID_ARGUMENT("size")
    if(p <= 0) throw errors.INVALID_ARGUMENT("page")
    let size = Number(s) || 30
    let page = Number(p) || 1
    return {size, page}
}

