import * as tmData from '../data/tm-events-data.mjs'

export async function getEventsByName(keyword, s, p) {
    if(!keyword) {
        throw `Invalid keyword`
    }
    const parameters = await validateParameters(s, p)
    const size = parameters.size
    const page = parameters.page
    return tmData.getEventsByName(keyword, size, page)
}

export async function getPopularEvents(s, p) {
    const parameters = await validateParameters(s, p)
    const size = parameters.size
    const page = parameters.page
    return tmData.getPopularEvents(size, page)
}

export async function getEventsById(eventId) {
    if (!eventId) {
        throw `Invalid event ID`
    }
    return tmData.getEventsById(eventId)
}

async function validateParameters(s, p) {
    let size = Number(s) || 30
    let page = Number(p) || 1
    return {size, page}
}

