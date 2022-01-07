import mongoose from "mongoose";

const ImageSchema = new mongoose.Schema({
    images: [
        {
            location: {type: String, required: true},
        }
    ]

},{
    timestamps: true,
})

export const ImageModal = mongoose.model("Images", ImageSchema);