const partialURL = `https://app.ticketmaster.com/discovery/v2/events`;
const apiKey = 'ScS7GANgbw2KFur1iOp7dpQME1gAdieS';

export async function getEventsByName(keyword, size, page) {
    const rsp = await fetch(`${partialURL}?apikey=${apiKey}&keyword=${keyword}&size=${size}&page=${page}`)
        .then(r => r.json())

    if(!rsp.hasOwnProperty("_embedded")) {
        return []
    }

    const events = processResults(rsp._embedded.events)
    return events
}

export async function getPopularEvents(size, page) {
    const rsp = await fetch(`${partialURL}?apikey=${apiKey}&size=${size}&page=${page}&sort=relevance,desc`)
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

    const event = standardEventDetails(rsp)

    return event
}

// Auxiliary functions
function processResults(results) {
    return results.map(e => standardEventDetails(e));
}

function standardEventDetails(data) {
    const date = String(data.dates.start.dateTime)
    const day = date.split("T")[0]
    const time = date.split("T")[1].slice(0, 5)
    const event = {
        "id": data.id,
        "name": data.name,
        "date": day.concat(" at ").concat(time).concat(" UTC"),
        "venue": {
            "name": data._embedded.venues[0].name,
            "country": data._embedded.venues[0].country.name,
            "city": data._embedded.venues[0].city.name,
        },
    };
    return event
}

