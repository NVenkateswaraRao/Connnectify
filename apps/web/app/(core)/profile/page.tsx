import ConnectifyProfile from ".";
import { getUserDetails } from "./action";

export default async function Profile() {
    const data = await getUserDetails();

    return (
        <ConnectifyProfile initialUserData={data} />
    )
}