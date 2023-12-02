// Mock implementation of the tm-events-data.mjs module

const mockEventData = [
    {
      id: 'mockEventId1',
      name: 'Mock Event 1',
      dates: {
        start: { dateTime: '2023-12-27T23:30:00Z' }
      },
      _embedded: {
        venues: [
          {
            name: 'Mock Venue',
            country: { name: 'Mock Country' },
            city: { name: 'Mock City' }
          }
        ]
      }
    },
    {
        id: 'mockEventId2',
        name: 'Mock Event 2',
        dates: {
            start: { dateTime: '2023-12-29T18:30:00Z' }
        },
        _embedded: {
            venues: [
            {
                name: 'Another Mock Venue',
                country: { name: 'Portugal' },
                city: { name: 'Chelas' }
            }
            ]
        }
    },
    {
        id: 'mockEventId3',
        name: 'Mock Event 3',
        dates: {
          start: { dateTime: '2023-12-31T22:00:00Z' }
        },
        _embedded: {
          venues: [
            {
              name: 'Mock Venue III',
              country: { name: 'Spain' },
              city: { name: 'Sevilla' }
            }
          ]
        }
    }
  ];
  
  export async function getEventsByName(keyword, size, page) {
    const results = mockEventData.filter(e => e.name.includes(keyword)).slice(page * size, (page + 1) * size);
    const events = processResults(results);
    return events;
  }
  
  export async function getPopularEvents(size, page) {
    const results = mockEventData.slice(page * size, (page + 1) * size);
    const events = processResults(results);
    return events;
  }
  
  export async function getEventsById(eventId) {
    const event = mockEventData.find((e) => e.id === eventId);
    if (event) {
      return standardEventDetails(event);
    }
    return null;
  }
  
  // Auxiliary functions
  function processResults(results) {
    return results.map((e) => standardEventDetails(e));
  }
  
  function standardEventDetails(data) {
    const event = {
      id: data.id,
      name: data.name,
      date: data.dates.start.dateTime,
      venue: {
        name: data._embedded.venues[0].name,
        country: data._embedded.venues[0].country.name,
        city: data._embedded.venues[0].city.name,
      },
    };
    return event;
  }