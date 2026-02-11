import { Express } from "express";
import { storage } from "./storage";
import { z } from "zod";

const otpRequestSchema = z.object({
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

const otpVerifySchema = z.object({
    phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
    otp: z.string().length(6, "OTP must be 6 digits"),
});

export function setupAuth(app: Express) {
    app.post("/api/auth/otp/request", async (req, res) => {
        try {
            const { phoneNumber } = otpRequestSchema.parse(req.body);
            let user = await storage.getUserByPhone(phoneNumber);

            if (!user) {
                user = await storage.createUser({ phoneNumber });
            }

            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

            await storage.updateUserOtp(user.id, otp, expiresAt);

            // In a real app, send SMS here. For prototype, we log it and return it for easy testing.
            console.log(`OTP for ${phoneNumber}: ${otp}`);

            // For convenience in testing (and prototype), returning OTP in response is okay if explicit.
            // But usually prevent it. Here I'm just sending success message.
            res.json({ message: "OTP sent successfully", devOtp: process.env.NODE_ENV === "development" ? otp : undefined });
        } catch (e) {
            if (e instanceof z.ZodError) {
                return res.status(400).json({ message: e.errors[0].message });
            }
            console.error(e);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    app.post("/api/auth/otp/verify", async (req, res) => {
        try {
            const { phoneNumber, otp } = otpVerifySchema.parse(req.body);
            const user = await storage.getUserByPhone(phoneNumber);

            if (!user || !user.otp || !user.otpExpiresAt) {
                return res.status(400).json({ message: "Invalid or expired OTP" });
            }

            if (new Date() > user.otpExpiresAt) {
                return res.status(400).json({ message: "OTP expired" });
            }

            if (user.otp !== otp) {
                return res.status(400).json({ message: "Invalid OTP" });
            }

            // Clear OTP
            await storage.updateUserOtp(user.id, null, null);

            // Set Session
            req.session.userId = user.id;

            // Save session explicitly to avoid race conditions
            req.session.save((err) => {
                if (err) {
                    console.error("Session save error:", err);
                    return res.status(500).json({ message: "Failed to create session" });
                }
                res.json(user);
            });

        } catch (e) {
            if (e instanceof z.ZodError) {
                return res.status(400).json({ message: e.errors[0].message });
            }
            console.error(e);
            res.status(500).json({ message: "Internal server error" });
        }
    });

    const adminLoginSchema = z.object({
        username: z.string(),
        password: z.string()
    });

    app.post("/api/auth/admin/login", async (req, res) => {
        try {
            const { username, password } = adminLoginSchema.parse(req.body);

            if (username === "admin" && password === "admin") {
                let user = await storage.getUserByPhone("admin");
                if (!user) {
                    user = await storage.createUser({ phoneNumber: "admin" });
                }

                // Force update role to admin to ensure correct permissions
                user = await storage.updateUserRole(user.id, "admin");

                req.session.userId = user.id;
                req.session.save((err) => {
                    if (err) return res.status(500).json({ message: "Session error" });
                    res.json(user);
                });
            } else {
                res.status(401).json({ message: "Invalid credentials" });
            }
        } catch (e) {
            res.status(400).json({ message: "Invalid request" });
        }
    });

    app.post("/api/auth/logout", (req, res) => {
        req.session.destroy((err) => {
            if (err) return res.status(500).json({ message: "Failed to logout" });
            res.json({ message: "Logged out successfully" });
        });
    });

    app.get("/api/auth/me", async (req, res) => {
        if (!req.session.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const user = await storage.getUser(req.session.userId);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }

        res.json(user);
    });
}
