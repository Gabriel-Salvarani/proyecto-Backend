import { Schema, model } from 'mongoose'
import IProduct  from '../interfaces/IProduct'

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  description: { type: String, default: "No tiene descripción" },
  price: { type: Number, default: 0, min: 0 },
  stock: { type: Number, default: 0, min: 0 },
  category: { type: String, default: "No tiene categoria" }
}, {
  versionKey: false
})

const Product: Model<IProduct> = model("Product", productSchema)

export default Product