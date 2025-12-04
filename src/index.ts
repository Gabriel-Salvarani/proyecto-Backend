import express, { Request, Response} from "express"
import connectDB from "./config/mongodb"
import dotenv from "dotenv"
import morgan from "morgan"
import logger from "./config/logger"
dotenv.config()

const PORT = process.env.PORT

const app = express()

app.use(express.json())

app.use(morgan("dev"))
app.use(logger)

app.get("/", (__: Request, res: Response) => {
  res.json({ status: true })
})

// servidor en escucha
app.listen(PORT, () => {
  console.log(`✅ Servidor en escucha en el puerto http://localhost:${PORT}`)
  connectDB()
})