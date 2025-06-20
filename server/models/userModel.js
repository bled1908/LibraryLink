import mongoose from "mongoose";
import jwt from "jsonwebtoken";

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

userSchema.methods.generateVerificationCode = function(){
    function generateRandomFiveDigitNumber(){
        const firstDigit = Math.floor(Math.random() * 9) + 1; // First digit cannot be 0
        const remainingDigits = Math.floor(Math.random() * 10000).toString().padStart(4, 0); // Generate 4 random digits
        return parseInt(firstDigit + remainingDigits); // Combine first digit with remaining digits to form a 5-digit number
    }
    const verificationCode = generateRandomFiveDigitNumber(); // Generate a random 5-digit verification code
    this.verificationCode = verificationCode; // Set the verification code on the user instance
    this.verificationCodeExpire = Date.now() + 15 * 60 * 1000; // Set the expiration time to 15 minutes from now
    return verificationCode; // Return the generated verification code
};

userSchema.methods.generateToken = function() {
    return jwt.sign({ id: this._id}, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_EXPIRE, // Token expiration time from environment variable
    });
};

export const User = mongoose.model("User", userSchema); // Create and export the User model based on the schema