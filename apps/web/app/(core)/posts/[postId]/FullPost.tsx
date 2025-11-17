"use client";

import Image from "next/image";
import CommentThread from "./CommentThread";
import CommentInput from "./CommentInput";

export default function FullPost({ post }: { post: any }) {
    return (
        <div className="bg-white dark:bg-neutral-900 rounded-xl shadow p-6">
            {/* Author */}
            <div className="flex gap-3 mb-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                    {post.author?.avatarUrl ? (
                        <Image
                            src={post.author.avatarUrl}
                            width={100}
                            height={100}
                            alt={post.author.name}
                        />
                    ) : (
                        <div className="bg-blue-500 text-white flex items-center justify-center w-full h-full">
                            {post.author.name[0].toUpperCase()}
                        </div>
                    )}
                </div>
                <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                        {post.author.name}
                    </div>
                    <div className="text-neutral-500 text-sm">
                        {new Date(post.createdAt).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Content */}
            <p className="text-neutral-800 dark:text-neutral-200 mb-4 text-lg">
                {post.content}
            </p>

            {/* Image */}
            {post.imageUrl && (
                <Image
                    src={post.imageUrl}
                    width={1024}
                    height={1024}
                    alt="Post image"
                    className="rounded-lg mb-4"
                />
            )}

            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-4">
                {post.tags?.map((tag: string, i: number) => (
                    <span
                        key={i}
                        className="text-xs px-3 py-1 bg-neutral-200 dark:bg-neutral-700 rounded-full"
                    >
                        #{tag}
                    </span>
                ))}
            </div>

            {/* Comment Input */}
            <CommentInput postId={post.id} />

            {/* Comments */}
            <CommentThread comments={post.comments.filter((c: any) => !c.parentId)} postId={post.id} allComments={post.comments} />

        </div>
    );
}
