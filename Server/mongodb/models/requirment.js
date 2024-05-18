import mongoose from "mongoose";

const RequirementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  propertyType: { type: String, required: true },
  dealType: { type: String, required: true },
  phone: { type: Number, required: true },
  askedPrice: { type: Number, required: true }, // Changed from "price" to "askedPrice"
  location: { type: String, required: true },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const requirementModel = mongoose.model("Requirement", RequirementSchema);

export default requirementModel;