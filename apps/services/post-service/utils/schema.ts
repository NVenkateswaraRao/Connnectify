import { z as zod } from "zod";

export enum PostType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    POLL = "POLL",
}

const pollOptionSchema = zod.object({
    text: zod.string().min(1),
});

export const createPostSchema = zod
    .object({
        content: zod.string().min(1),
        type: zod.enum([PostType.TEXT, PostType.IMAGE, PostType.POLL]),
        imageUrl: zod.string().url().optional(),
        communityId: zod.string().cuid().optional(),
        pollOptions: zod.array(pollOptionSchema).optional(),
    })
    .superRefine((data, ctx) => {
        if (data.type === PostType.POLL) {
            if (!data.pollOptions || data.pollOptions.length < 2) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: "A poll must have at least 2 options.",
                    path: ["pollOptions"],
                });
            }
        } else {
            // If it's not a POLL, make sure pollOptions is NOT sent
            if (data.pollOptions) {
                ctx.addIssue({
                    code: zod.ZodIssueCode.custom,
                    message: "Only poll posts can include poll options.",
                    path: ["pollOptions"],
                });
            }
        }
    });
