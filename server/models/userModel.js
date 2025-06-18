import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
        select: false, // Exclude password from queries by default
    },
    role: {
        type: String,
        enum: ["Admin", "User"], // Only allow 'user' or 'admin' roles
        default: "User",
    },
    accountVerified: { type: Boolean, default: false },
    borrowedBooks: [
        {
            bookID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Borrow" // Reference to the Borrow model
            },
            returned: {
                type: Boolean,
                default: false // Indicates if the book has been returned
            },
            bookTitle: String,
            borrowedDate: Date,
            dueDate: Date,
        },
    ],
    avatar: {
        public_id: String,
        url: String,
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
 },
 {
    timestamps: true,   
 }
);

export const User = mongoose.model("User", userSchema); // Create and export the User model based on the schema