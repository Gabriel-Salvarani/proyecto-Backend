import { connect } from "mongoose"

const connectDB = async () => {
  const DB_URL = process.env.DB_URL!
  try {
    await connect(DB_URL)
    console.log("✅ Conectado a Mongo DB con éxito!")
  } catch (e) {
    console.log("❌ Error al conectarse a Mongo DB")
    process.exit(1)
  }
}

export default connectDB