import { Schema, model, models } from "mongoose"

const TransactionSchema = new Schema(
  {
    stripeId: { type: String, required: true },
    amount: { type: Number, required: true },
    credits: { type: Number, required: true },
    plan: { type: String, required: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
)

const Transaction = models?.Transaction || model("Transaction", TransactionSchema)

export default Transaction
