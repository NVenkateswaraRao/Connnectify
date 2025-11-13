import express, { type Request, type Response } from 'express';
import prisma from "@/prisma/index.js";
import { createPostSchema } from '@/utils/schema';
import { authMiddleware, type AuthenticatedRequest } from '@/utils/authMiddleware';

export const postRouter = express.Router();


//get all posts
postRouter.get("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }
        const posts = await prisma.post.findMany({})

        res.status(200).json({ posts });
    }
    catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

//get all posts for a community
postRouter.get("/community/:communityId", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { communityId } = req.params;

        if (!communityId) {
            return res.status(401).json({ error: "Community ID not provided" });
        }

        const posts = await prisma.post.findMany({
            where: {
                communityId: communityId
            }
        })

        res.status(200).json({ posts });
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});


//create a post
postRouter.post("/", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.user?.userId;


    if (!userId) {
        return res.status(401).json({ error: "User not authenticated" });
    }

    try {
        console.log("Request body:", req.body);
        const parsedResponse = createPostSchema.safeParse(req.body);

        if (!parsedResponse.success) {
            console.error("Validation errors:", parsedResponse.error);
            return res.status(400).json({ error: "Invalid post data", details: parsedResponse.error });
        }

        const data = await prisma.post.create({
            data: {
                content: parsedResponse.data.content,
                type: parsedResponse.data.type,
                imageUrl: parsedResponse.data.imageUrl ?? null,
                authorId: userId,
                communityId: parsedResponse.data.communityId ?? null,

            },

        });
        if (parsedResponse.data.pollOptions && parsedResponse.data.type === 'POLL') {
            console.log("Creating poll options");
            for (const option of parsedResponse.data.pollOptions) {
                await prisma.pollOption.create({
                    data: {
                        text: option.text,
                        postId: data.id,
                    }
                });
            }
        }
        res.status(201).json({ post: data });


    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});