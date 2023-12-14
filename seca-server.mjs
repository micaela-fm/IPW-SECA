// Module that constitutes the entry point to the server application

// Importing external libraries
import express from "express"
import swaggerUi from "swagger-ui-express"
import yaml from "yamljs"
import cors from "cors"
import hbs from "hbs"

// Importing internal modules
import * as secaEventsServices from "./services/seca-events-services.mjs"
import initGroupsServices from "./services/seca-groups-services.mjs"
import initUsersServices from "./services/seca-users-services.mjs"
//import * as secaGroupsServices from "./services/seca-groups-services.mjs"
//import * as secaUsersServices from "./services/seca-users-services.mjs"
import apiInit from "./web/api/seca-web-api.mjs"
import siteInit from "./web/site/seca-web-site.mjs"
// import secaDataInit from "./data/seca-data-mem.mjs"
import secaDataInit from "./data/seca-data-db.mjs"


// Reading content from yaml doc
const swaggerDocument = yaml.load("./seca-api.yaml")
// Reading port number from .env file
const PORT = 3000

// Initializing secaServices and api
const secaData = secaDataInit()
const secaUsersServices = initUsersServices(secaData)
const secaGroupsServices = initGroupsServices(secaUsersServices, secaData)
const api = apiInit(secaEventsServices, secaGroupsServices, secaUsersServices)
const site = siteInit(secaEventsServices, secaGroupsServices, secaUsersServices)


// Creating and initializing the Express application
console.log("Starting server set up")
const app = express()

app.use(cors())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())
app.set('view engine', 'hbs')
app.set('views', path.join(__dirname, 'views'))

// HTTP Site Routes
app.get("/seca/events", site.searchEvents)

app.get("/seca/events/popular", site.getPopularEvents)

app.get("/seca/groups", site.listGroups)
app.post("/seca/groups", site.createGroup)

app.get("/seca/groups/:id", site.getGroupDetails)
app.put("/seca/groups/:id", site.editGroup)
app.delete("/seca/groups/:id", site.deleteGroup)

app.post("/seca/groups/:id/events", site.addEvent)

app.delete("/seca/groups/:id/events/:eventId", site.removeEvent)

app.post("/seca/users", site.createUser)

// Registering all HTTP api routes
/* app.get("/events", api.searchEvents)

app.get("/events/popular", api.getPopularEvents)

app.get("/groups", api.listGroups)
app.post("/groups", api.createGroup)

app.get("/groups/:id", api.getGroupDetails)
app.put("/groups/:id", api.editGroup)
app.delete("/groups/:id", api.deleteGroup)

app.post("/groups/:id/events", api.addEvent)

app.delete("/groups/:id/events/:eventId", api.removeEvent)

app.post("/users", api.createUser) */

app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`))

console.log("Ending server set up")

export default app
