// Module that constitutes the entry point to the server application

// Importing external libraries
import express from "express"
import swaggerUi from "swagger-ui-express"
import yaml from "yamljs"
import cors from "cors"
import hbs from "hbs"
import path from "path"
import url from "url"

// Importing internal modules
import * as secaEventsServices from "./services/seca-events-services.mjs"
import initGroupsServices from "./services/seca-groups-services.mjs"
import initUsersServices from "./services/seca-users-services.mjs"
//import * as secaGroupsServices from "./services/seca-groups-services.mjs"
//import * as secaUsersServices from "./services/seca-users-services.mjs"
import apiInit from "./web/api/seca-web-api.mjs"
import siteInit from "./web/site/seca-web-site.mjs"
import secaDataInit from "./data/seca-data-mem.mjs"
// import secaDataInit from "./data/seca-data-db.mjs"


// Reading content from yaml doc
const swaggerDocument = yaml.load("./seca-api.yaml")

// TODO: Reading port number from .env file
// import dotenv from 'dotenv'
// dotenv.config({ path: './.env' })
// const PORT = process.env.PORT
const PORT = 3000

// Initializing secaServices, api and site
const secaData = secaDataInit()
const secaUsersServices = initUsersServices(secaData)
const secaGroupsServices = initGroupsServices(secaUsersServices, secaData)
const api = apiInit(secaEventsServices, secaGroupsServices, secaUsersServices)
const site = siteInit(secaEventsServices, secaGroupsServices, secaUsersServices)

// Creating and initializing the Express application
console.log("Starting server set up")
const app = express()

// Initializing middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded( {extended: true }))
app.use('/seca', express.static('./web/site/views'))

// Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

// Handlebars view engine setup
const currentFileDir = url.fileURLToPath(new URL('.', import.meta.url))
const viewsDir = path.join(currentFileDir, 'web', 'site', 'views')
app.set('view engine', 'hbs')
app.set('views', viewsDir)

// HTTP Site Routes
app.get("/seca/events", site.searchEvents)
app.get("/seca/events/popular", site.getPopularEvents)

app.get("/seca/groups", site.listGroups)
app.post("/seca/groups", site.createGroup)
app.get("/seca/groups/:id", site.getGroupDetails) // TODO
app.put("/seca/groups/:id", site.editGroup) // TODO
app.delete("/seca/groups/:id", site.deleteGroup) // TODO

app.post("/seca/groups/:id/events", site.addEvent) // TODO
app.delete("/seca/groups/:id/events/:eventId", site.removeEvent) // TODO

app.post("/seca/users", site.createUser) // TODO


// HTTP API Routes
app.get("/events", api.searchEvents)
app.get("/events/popular", api.getPopularEvents)

app.get("/groups", api.listGroups)
app.post("/groups", api.createGroup)
app.get("/groups/:id", api.getGroupDetails)
app.put("/groups/:id", api.editGroup)
app.delete("/groups/:id", api.deleteGroup)
app.post("/groups/:id/events", api.addEvent)
app.delete("/groups/:id/events/:eventId", api.removeEvent)

app.post("/users", api.createUser) 

// Setting and logging server listening port
app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`))
console.log("Ending server set up")

export default app
