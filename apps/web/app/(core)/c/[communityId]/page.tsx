import CommunityPageComponent from ".";
import { getAllPosts, getCommunityDetails } from "./action";

export default async function CommunityPage(props: { params: Promise<{ communityId: string }> }) {
    const { communityId } = await props.params;

    if (!communityId) {
        throw new Error("Community id not found");
    }

    console.log("Community Name:", communityId);

    const posts = await getAllPosts(communityId);
    console.log("Posts:", posts);   
    const communityDetail = await getCommunityDetails(communityId);

    return <CommunityPageComponent posts={posts} community={communityDetail} />;
}
