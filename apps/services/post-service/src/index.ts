import express from 'express';
import cors from "cors";
import cookieParser from "cookie-parser"
import { postRouter } from './routes';

const app = express();
const port = process.env.PORT || 3003;


app.use(cors({
    origin: "http://localhost:3000", // The origin of your frontend
    credentials: true, // This is the crucial part
}));

app.use(cookieParser());
app.use(express.json());

app.use("/api/posts",postRouter)


app.listen(port, () => {
    console.log("Post service is listenting at ", port)
})