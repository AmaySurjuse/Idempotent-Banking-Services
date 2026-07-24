import app from "./src/app.js"
import connectdb from "./config/database.js"
import { processoutbox } from "./workers/outboxworker.js"

connectdb()

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
    console.log(`Server has started at port : ${PORT}`)
})

// Starts the mailman worker to check for events every 5 seconds
setInterval(processoutbox, 5000)

console.log("Outbox worker started")