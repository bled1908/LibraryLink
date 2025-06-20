export const sendToken = (user, statusCode, message, res) => {
    const token = user.generateToken();
    res.status(statusCode).cookie("token", token, {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // Set cookie expiration based on environment variable
        ),
        httpOnly: true, // Make the cookie HTTP only to prevent client-side access
    }).json({
        success: true,
        user,
        message,
        token,
    });
};