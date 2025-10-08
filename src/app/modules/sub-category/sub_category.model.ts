import { Schema, model, Types, Document } from "mongoose";


export interface TSubCategory extends Document {
  name: string;
  mainCategoryId: Types.ObjectId;
}


const SubCategorySchema = new Schema<TSubCategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    mainCategoryId: {
      type: Schema.Types.ObjectId,
      ref: "MainCategory",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

SubCategorySchema.index({ name: 1, mainCategoryId: 1 }, { unique: true });
export const SubCategory = model<TSubCategory>("SubCategory", SubCategorySchema);


