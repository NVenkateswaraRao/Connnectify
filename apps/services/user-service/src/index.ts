import express from "express"
import { PrismaClient } from "./generated/prisma/client.ts";
import { authRouter } from "./routes/auth.ts";
import cookieParser from "cookie-parser";
import "dotenv/config";
import cors from "cors";


const prisma = new PrismaClient();

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: "http://localhost:3000", // The origin of your frontend
  credentials: true, // This is the crucial part
}));

app.use(express.json())
app.use(cookieParser());

app.use("/api/auth", authRouter)

app.get("/", (req, res) => {
  res.send("User Service is running")
})

app.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`)
})
