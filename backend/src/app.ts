import express from 'express'
import cors from 'cors'
import { requestLogger } from "./middleware/requestLogger.middleware";
import { errorMiddleware } from "./middleware/errorLogger.middleware";

const app =express()

app.use(cors())
app.use(express.json({limit:32}),express.urlencoded({limit:32}))
app.use(errorMiddleware)
app.use(requestLogger)


export default app