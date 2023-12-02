// Module that constitutes the entry point to the server application

// Importing external libraries
import express from "express"
import swaggerUi from "swagger-ui-express"
import yaml from "yamljs"
import cors from "cors"
import * as dotenv from "dotenv"
dotenv.config()

// Importing internal modules
import * as secaData from "./data/seca-data-mem.js"
import * as tmData from "./data/tm-events-data.js"
import * as secaEventsServices from "./services/seca-events-services.js"
import * as secaGroupsServices from "./services/seca-groups-services.js"
import * as secaUsersServices from "./services/seca-users-services.js"
import apiInit from "./api/seca-web-api.js"


// Reading content from yaml doc
const swaggerDocument = yaml.load("./seca-api.yaml")
// Reading port number from .env file
const PORT = process.env.PORT

// // Seeding Ticketmaster events
// await tmData.startEventCache(process.env.SEED_EVENT_CACHE);

// Initializing secaServices and api
const api = apiInit(secaEventsServices, secaGroupsServices, secaUsersServices)

// Creating and initializing the Express application
console.log("Starting server set up")
const app = express()

app.use(cors())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))
app.use(express.json())

// Registering all HTTP api routes
app.get("/events", api.searchEvents)

app.get("/events/popular", api.getPopularEvents)

app.get("/groups", api.listsGroups)
app.post("/groups", api.createGroup)

api.get("/groups/:id", api.getGroupDetails)
api.put("/groups/:id", api.editGroup)
api.delete("/groups/:id", api.deleteGroup)

api.post("/groups/:id/events", api.addEvent)

api.delete("/groups/:id/events/:eventId", api.removeEvent)

app.post("/users", api.createUser)

app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`))

console.log("Ending server set up")

export default app
