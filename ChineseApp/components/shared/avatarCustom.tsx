import { ImageSourcePropType } from "react-native";
import { Avatar } from "react-native-paper";

const AvatarCustom = ({
  avatar,
  size = 40,
}: {
  avatar: ImageSourcePropType | string | null;
  size?: number;
}) => {
  if (avatar === "" || !avatar) {
    return (
      <Avatar.Icon
        size={size}
        icon="account-circle-outline"
        style={{ backgroundColor: "#2196F3" }}
      />
    );
  }
  const source = typeof avatar === "string" ? { uri: avatar } : avatar;
  return <Avatar.Image source={source} size={size} />;
};

export default AvatarCustom;
