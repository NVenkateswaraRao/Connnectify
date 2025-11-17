"use client";

import { useState } from "react";
import CommentInput from "./CommentInput";

function Comment({ comment, postId, allComments }: { comment: any, postId: string, allComments: any[] }) {
    const [replying, setReplying] = useState(false);

    const replies = allComments.filter(c => c.parentId === comment.id);

    return (
        <div className="mb-4">
            <div className="flex gap-3 mb-2">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    {comment.author?.profileImageUrl ? (
                        <img
                            src={comment.author.profileImageUrl}
                            alt={comment.author.username}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="bg-purple-500 text-white flex items-center justify-center w-full h-full">
                            {comment.author?.name[0]?.toUpperCase()}
                        </div>
                    )}
                </div>

                <div>
                    <div className="font-semibold text-neutral-900 dark:text-white">
                        {comment.author.name}
                    </div>
                    <p className="text-neutral-700 dark:text-neutral-300">{comment.text}</p>
                    <div className="text-xs text-neutral-500 mt-1">
                        {new Date(comment.createdAt).toLocaleString()}
                    </div>

                    <button
                        onClick={() => setReplying(!replying)}
                        className="text-xs text-blue-600 mt-1"
                    >
                        Reply
                    </button>
                </div>
            </div>

            {/* Reply input */}
            {replying && (
                <div className="ml-12">
                    <CommentInput
                        postId={postId}
                        replyTo={comment}
                        cancelReply={() => setReplying(false)}
                    />
                </div>
            )}

            {/* Render nested replies */}
            {replies.length > 0 && (
                <div className="ml-12">
                    <CommentThread comments={replies} postId={postId} allComments={allComments} />
                </div>
            )}
        </div>
    );
}

export default function CommentThread({ comments, postId, allComments }: { comments: any[], postId: string, allComments: any[] }) {
    return (
        <div className="mt-6">
            {comments.length === 0 && <p className="text-neutral-500">No comments yet.</p>}

            {comments.map(comment => (
                <Comment key={comment.id} comment={comment} postId={postId} allComments={allComments} />
            ))}
        </div>
    );
}
