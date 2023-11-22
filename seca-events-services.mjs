import * as tmData from './tm-events-data.mjs'

export async function getEventsByName(keyword, s, p) {
    if(!keyword) {
        throw `Invalid keyword`
    }
    const limit = s || 30
    const page = p || 1
    return tmData.getEventsByName(keyword, limit, page)
}

export async function getPopularEvents(s, p) {
    const limit = s || 30
    const page = p || 1
    return tmData.getPopularEvents(limit, page)
}