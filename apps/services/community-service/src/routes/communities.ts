import express, { type Request, type Response } from "express";
import prisma from "@/prisma/index.js";
import { authMiddleware, type AuthenticatedRequest } from "@/utils/authMiddleware";

export const communityRouter = express.Router();

//get all joined communities for a user
communityRouter.get("/user/communities", authMiddleware, async (req: AuthenticatedRequest, res: Response) => {
    console.log("Fetching communities for user:", req.user);
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
    }

    const communities = await prisma.community.findMany({
        where: {
            members: {
                some: {
                    userId: userId
                }
            }
        },
        include: {
            _count: {
                select: {
                    members: true
                }
            }
        }
    });

    res.status(200).json({ communities });
});


//join a community for a user
communityRouter.post(
    "/:communityId/join",
    authMiddleware,
    async (req: AuthenticatedRequest, res: Response) => {
        const { communityId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        if (!communityId) {
            return res.status(400).json({ error: "Community ID is required" });
        }

        try {
            // Check if community exists
            const community = await prisma.community.findUnique({
                where: { id: communityId },
            });

            if (!community) {
                return res.status(404).json({ error: "Community not found" });
            }

            // Check if user is already a member
            const existingMembership = await prisma.membership.findUnique({
                where: {
                    userId_communityId: {
                        userId,
                        communityId,
                    },
                },
            });

            if (existingMembership) {
                return res.status(400).json({ error: "User already joined this community" });
            }

            // Create membership
            const membership = await prisma.membership.create({
                data: {
                    userId,
                    communityId,
                },
            });

            res.status(201).json({
                message: "Successfully joined the community",
                membership,
            });
        } catch (error) {
            console.error("Error joining community:", error);
            res.status(500).json({ error: "Failed to join community" });
        }
    }
);

//leave a community for a user
communityRouter.delete(
    "/:communityId/leave",
    authMiddleware,
    async (req: AuthenticatedRequest, res: Response) => {
        const { communityId } = req.params;
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        if (!communityId) {
            return res.status(400).json({ error: "Community ID is required" });
        }

        try {
            // Check if membership exists
            const membership = await prisma.membership.findUnique({
                where: {
                    userId_communityId: {
                        userId,
                        communityId,
                    },
                },
            });

            if (!membership) {
                return res.status(404).json({ error: "User is not a member of this community" });
            }

            // Delete the membership
            await prisma.membership.delete({
                where: {
                    userId_communityId: {
                        userId,
                        communityId,
                    },
                },
            });

            res.status(200).json({ message: "Successfully left the community" });
        } catch (error) {
            console.error("Error leaving community:", error);
            res.status(500).json({ error: "Failed to leave community" });
        }
    }
);
