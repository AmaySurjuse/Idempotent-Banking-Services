import app from "./src/app.js"
import connectdb from "./config/database.js"
import { processoutbox } from "./workers/outboxworker.js"

connectdb()

app.listen( 7001, () => {
    console.log("Server has started at port : 7001")
})

setInterval(processoutbox, 5000)

console.log("Outbox worker started")