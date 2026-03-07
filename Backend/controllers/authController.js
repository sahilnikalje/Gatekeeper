const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const { sendEmail } = require('../config/nodemailer')
const { EMAIL_VERIFY_TEMPLATE, PASSWORD_RESET_TEMPLATE, WELCOME_EMAIL_TEMPLATE } = require('../config/emailTemplates')

// register
const register = async (req, res) => {
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are mandatory" })
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists" })
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ name, email, password: hashedPassword })
        await user.save()

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        res.status(201).json({ success: true, message: "Registered successfully" })

        sendEmail({
            to: email,
            subject: "Welcome to Gatekeeper",
            html: WELCOME_EMAIL_TEMPLATE.replace("{{email}}", email)
        }).catch(err => console.error("EMAIL ERROR:", err))

    } catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }
}

// login
const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are mandatory" })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(403).json({ success: false, message: "Invalid email" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(403).json({ success: false, message: "Invalid password" })
        }

        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000
        })

        return res.status(200).json({ success: true, message: "Logged in successfully" })

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

// logout
const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })
        return res.status(200).json({ success: true, message: "Logged out successfully" })
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

// send verification otp
const sendVerifyOtp = async (req, res) => {
    try {
        const userId = req.user.id
        const user = await User.findById(userId)

        if (user.isAccountVerified) {
            return res.status(409).json({ success: false, message: "Account already verified" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.verifyOtp = otp
        user.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000
        await user.save()

        await sendEmail({
            to: user.email,
            subject: "Account verification OTP",
            html: EMAIL_VERIFY_TEMPLATE
                .replace("{{otp}}", otp)
                .replace("{{email}}", user.email)
        })

        res.status(200).json({ success: true, message: "Verification OTP sent to email" })

    } catch (err) {
        res.status(400).json({ success: false, message: err.message })
    }
}

// verify email using otp
const verifyEmail = async (req, res) => {
    const userId = req.user.id
    const { otp } = req.body

    if (!userId || !otp) {
        return res.status(401).json({ success: false, message: "Missing details" })
    }

    try {
        const user = await User.findById(userId)
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        if (user.verifyOtp === "" || user.verifyOtp !== otp) {
            return res.status(403).json({ success: false, message: "Invalid OTP" })
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" })
        }

        user.isAccountVerified = true
        user.verifyOtp = ''
        user.verifyOtpExpireAt = 0
        await user.save()

        return res.status(200).json({ success: true, message: "Email verified successfully" })

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

// check if authenticated
const isAuthenticated = async (req, res) => {
    try {
        return res.status(200).json({ success: true, message: "User is authenticated" })
    } catch (err) {
        res.status(401).json({ success: false, message: err.message })
    }
}

// send password reset otp
const sendResetOtp = async (req, res) => {
    const { email } = req.body
    if (!email) {
        return res.status(400).json({ success: false, message: "Email is required" })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        const otp = String(Math.floor(100000 + Math.random() * 900000))
        user.resetOtp = otp
        user.resetOtpExpireAt = Date.now() + 5 * 60 * 1000
        await user.save()

        await sendEmail({
            to: user.email,
            subject: "Password reset OTP",
            html: PASSWORD_RESET_TEMPLATE
                .replace("{{otp}}", otp)
                .replace("{{email}}", user.email)
        })

        res.status(200).json({ success: true, message: "Reset OTP sent to email" })

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

// reset password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ success: false, message: "All fields are mandatory" })
    }

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" })
        }

        if (user.resetOtp === "" || user.resetOtp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" })
        }

        if (user.resetOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "OTP expired" })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)
        user.password = hashedPassword
        user.resetOtp = ""
        user.resetOtpExpireAt = 0
        await user.save()

        return res.status(200).json({ success: true, message: "Password reset successfully" })

    } catch (err) {
        return res.status(500).json({ success: false, message: err.message })
    }
}

module.exports = { register, login, logout, sendVerifyOtp, verifyEmail, isAuthenticated, sendResetOtp, resetPassword }