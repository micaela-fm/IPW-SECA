// Module that constitutes the entry point to the server application

// Importing external libraries
import express from "express"
import swaggerUi from "swagger-ui-express"
import yaml from "yamljs"
import cors from "cors"

// Importing internal modules
import * as secaEventsServices from "./services/seca-events-services.mjs"
import * as secaGroupsServices from "./services/seca-groups-services.mjs"
import * as secaUsersServices from "./services/seca-users-services.mjs"
import apiInit from "./api/seca-web-api.mjs"


// Reading content from yaml doc
const swaggerDocument = yaml.load("./seca-api.yaml")
// Reading port number from .env file
const PORT = 3000

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

app.get("/groups", api.listGroups)
app.post("/groups", api.createGroup)

app.get("/groups/:id", api.getGroupDetails)
app.put("/groups/:id", api.editGroup)
app.delete("/groups/:id", api.deleteGroup)

app.post("/groups/:id/events", api.addEvent)

app.delete("/groups/:id/events/:eventId", api.removeEvent)

app.post("/users", api.createUser)

app.listen(PORT, () => console.log(`Server listening in http://localhost:${PORT}`))

console.log("Ending server set up")

export default app
