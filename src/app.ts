import express from "express"
import MiddlewareSetup from "./middleware/MiddlewareSetup"
import router from "./routes/route"

const app = express()

app.use(MiddlewareSetup)
app.use("/api", router)

const port = 8080
app.listen(port, () => {
    console.log(`Connected to the server on port ${port}`)
})