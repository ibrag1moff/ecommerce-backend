import express from "express";
import type { Express, Request, Response } from "express";

import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./db";

import { authRouter } from "./routes/auth";
import { productRouter } from "./routes/products";
import { adminRouter } from "./routes/admin";
import { cartRouter } from "./routes/cart";
import { subscribersRouter } from "./routes/subscribers";

const app: Express = express();

// Load enviroment variables
dotenv.config();

// Connect database
connectDB();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));

// Routes
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/cart", cartRouter);
app.use("/admin", adminRouter);
app.use("/subscribers", subscribersRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Lombardi API 🚀");
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on http://localhost:${process.env.PORT}`)
);
