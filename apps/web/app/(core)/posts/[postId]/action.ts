"use server";

import axios from "axios";

export async function getFullPost(postId: string) {
    // Fetch raw post
    const postRes = await axios.get(`http://localhost:3003/api/posts/${postId}`);
    const post = postRes.data.post;

    console.log("Fetched post:", post);

    // Fetch post author
    const authorRes = await fetch(`http://localhost:3001/api/auth/${post.authorId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const author = await authorRes.json().then((data) => data.user);

    console.log("Fetched author:", author);

    // Fetch raw comments
    const commentsRes = await axios.get(
        `http://localhost:3003/api/posts/${postId}/comments`
    );
    const comments = commentsRes.data.comments;

    // Fetch comment authors
    const authorIds = [...new Set(comments.map((c: any) => c.authorId))];
    const usersRes = await axios.post(`http://localhost:3001/api/auth/bulk`, {
        ids: authorIds,
    });
    console.log("Fetched comment authors response:", usersRes.data);
    const usersMap = Object.fromEntries(
        usersRes.data.users.map((u: any) => [u.id, u])
    );

    console.log("Fetched comment authors:", usersMap);

    // Attach author data to comments
    const enrichedComments = comments.map((c: any) => ({
        ...c,
        author: usersMap[c.authorId]
    }));

    return {
        ...post,
        author,
        comments: enrichedComments
    };
}
