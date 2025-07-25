import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";

export const getAllUsers = catchAsyncErrors(async (req, res, next) => {
    const users = await User.find({ accountVerified: true }); // to find only users, in parenthesis do {role: "User"}
    res.status(200).json({
        success: true,
        users,
    });
});

export const registerNewAdmin = catchAsyncErrors(async (req, res, next) => {
    if(!req.files || Object.keys(req.files).length === 0) {
        return next(new ErrorHandler("Admin Avatar is required.", 400));
    }
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new ErrorHandler("Please provide all fields.", 400));
    }
    const isRegistered = await User.findOne({ email, accountVerified: true });
    if (isRegistered) {
        return next(new ErrorHandler("User already registered.", 400));
    }
    if (password.length < 8 || password.length > 16) {
        return next(new ErrorHandler("Password must be between 8 and 16 characters.", 400));
    }
    const { avatar } = req.files;
    const allowedFormats = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
    if (!allowedFormats.includes(avatar.mimetype)) {
        return next(new ErrorHandler("Invalid image format. Allowed formats: jpeg, png, jpg, webp.", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
            folder: "LIBRARY_MANAGEMENT_SYSTEM_ADMIN_AVATARS",
        }
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
        console.error(
            "Cloudinary error:", 
            cloudinaryResponse.error || "Unknown cloudinary error."
        );
        return next(new ErrorHandler("Failed to upload avatar to Cloudinary.", 500));
    }
    const admin = await User.create({
        name, 
        email, 
        password: hashedPassword,
        role: "Admin",
        accountVerified: true,
        avatar: {
            public_id: cloudinaryResponse.public_id,
            url: cloudinaryResponse.secure_url,
        },
    });
    res.status(201).json({
        success: true,
        message: "Admin registered successfully.",
        admin,
    });
});

