
import { getFullPost } from "./action";
import FullPost from "./FullPost";


export default async function PostPage(props: { params: Promise<{ postId: string }> }) {
    const params = await props.params;
    console.log("Rendering PostPage for postId:", params.postId);
    const data = await getFullPost(params.postId);
    console.log("Fetched post data:", data.comments);

    return (
        <div className="max-w-2xl mx-auto py-8">
            <FullPost post={data} />
        </div>
    );
}
