import { Schema, model, models, type Document } from "mongoose"

export interface IImage extends Document {
  title: string
  publicId: string
  transformationType: string
  width: number
  height: number
  config: Record<string, unknown>
  secureURL: string
  transformationURL: string
  aspectRatio?: string
  prompt?: string
  color?: string
  author: Schema.Types.ObjectId
}

const ImageSchema = new Schema(
  {
    title: { type: String, required: true },
    publicId: { type: String, required: true },
    transformationType: { type: String, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    config: { type: Schema.Types.Mixed, default: {} },
    secureURL: { type: String, required: true },
    transformationURL: { type: String, required: true },
    aspectRatio: { type: String },
    prompt: { type: String },
    color: { type: String },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

const Image = models?.Image || model("Image", ImageSchema)

export default Image
