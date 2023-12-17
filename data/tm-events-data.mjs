const partialURL = `https://app.ticketmaster.com/discovery/v2/events`;
const apiKey = 'ScS7GANgbw2KFur1iOp7dpQME1gAdieS';

export async function getEventsByName(keyword, size, page) {
    const rsp = await fetch(`${partialURL}?apikey=${apiKey}&size=${size}&page=${page - 1}&keyword=${keyword}`)
        .then(r => r.json())

    if(!rsp.hasOwnProperty("_embedded")) {
        return []
    }

    const events = processResults(rsp._embedded.events)
    return events
}

export async function getPopularEvents(size, page) {
    const rsp = await fetch(`${partialURL}?apikey=${apiKey}&size=${size}&page=${page - 1}&sort=relevance,desc`)
        .then(r => r.json())
    if (rsp._embedded.events != null) {
        const events = processResults(rsp._embedded.events)
        return events
    }
    return []
}

export async function getEventById(eventId) {
    const rsp = await fetch(`${partialURL}/${eventId}.json?apikey=${apiKey}`)
        .then(r => r.json());

    if (!rsp || !rsp._embedded) return null

    const event = standardEventDetails(rsp, true)

    return event
}

// Auxiliary functions
function processResults(results, moreDetails) {
    if (!results || !Array.isArray(results)) {
        throw new Error('Invalid results')
    }

    return results
        .filter(result => result && result._embedded && result._embedded.venues && result._embedded.venues[0])
        .map(e => standardEventDetails(e, moreDetails))
}

function standardEventDetails(data, moreDetails = false) {
    const date = String(data.dates.start.dateTime).split("T")
    const day = date[0]
    const time = date.length > 1 ? date[1].slice(0, 5) : '00:00'
    const event = {
        "id": data.id,
        "name": data.name,
        "date": `${day} | ${time}`,
        "venue": {
            "name": data._embedded.venues[0].name,
            "country": data._embedded.venues[0].country.name,
            "city": data._embedded.venues[0].city.name,
        }
    }

    if(moreDetails) {
        const salesStart = String(data.sales.public.startDateTime).split("T")
        const salesStartDay = salesStart[0]
        const salesStartTime = salesStart.length > 1 ? salesStart[1].slice(0, 5) : '00:00'
        event.salesStart = `${salesStartDay} | ${salesStartTime}`

        const salesEnd = String(data.sales.public.endDateTime).split("T")
        const salesEndDay = salesEnd[0]
        const salesEndTime = salesEnd.length > 1 ? salesEnd[1].slice(0, 5) : '00:00'
        event.salesEnd = `${salesEndDay} | ${salesEndTime}`

        event.image = data.images[0].url
        event.segment = data.classifications[0].segment.name
        event.genre = data.classifications[0].genre.name
        event.subgenre = data.classifications[0].subGenre.name

    }

    return event
}

