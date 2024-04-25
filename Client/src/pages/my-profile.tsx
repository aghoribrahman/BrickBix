import { useGetIdentity, useOne } from "@refinedev/core";
import Profile from "../components/common/Profile";
import { useActiveAuthProvider } from "@refinedev/core";

const MyProfile = () => {
  const authProvider = useActiveAuthProvider();
  const { data: user } = useGetIdentity({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });
  const { data, isLoading, isError } = useOne({
    resource: "users",
    id: user?.userid,
  });

  const myProfile = data?.data ?? {};

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  // Check if myProfile is an object with the name property
  if (!myProfile || typeof myProfile !== "object" || !("name" in myProfile)) {
    return <div>No profile found</div>;
  }

  return (
    <Profile
      type="My"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      properties={myProfile.allProperties}
    />
  );
};

export default MyProfile;
