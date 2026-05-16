import type { Request, Response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../utils/prisma.js";
import logger from "../utils/logger.js";
import { z } from "zod";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// Validation schemas with custom error messages
const RegisterSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(1, "Name is required"),
});

const LoginSchema = z.object({
  email: z.string().email("Invalid email format").min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
});

// Helper function to format validation errors
const formatValidationErrors = (
  issues: z.ZodIssue[],
): Record<string, string> => {
  const formatted: Record<string, string> = {};
  issues.forEach((error: z.ZodIssue) => {
    const path = error.path.join(".");
    formatted[path] = error.message;
  });
  return formatted;
};

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, name } = RegisterSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "Email already registered",
        errors: { email: "This email is already in use" },
      });
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const formattedErrors = formatValidationErrors(error.issues);
      return res.status(400).json({
        status: "error",
        message: "Please check your input",
        errors: formattedErrors,
      });
    }

    console.error("[REGISTER] Unexpected error:", error.message, error.stack);
    logger.error("[REGISTER] Unexpected error:", error);
    return res.status(500).json({
      status: "error",
      message: "Registration failed. Please try again later.",
    });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Check password
    const passwordMatch = await bcryptjs.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        status: "error",
        message: "Invalid email or password",
      });
    }

    // Generate token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token,
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      const formattedErrors = formatValidationErrors(error.issues);
      return res.status(400).json({
        status: "error",
        message: "Please check your input",
        errors: formattedErrors,
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Login failed. Please try again later.",
    });
  }
};

export const me = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    return res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error: any) {
    return res.status(500).json({
      status: "error",
      message: error.message || "Failed to fetch user",
    });
  }
};
