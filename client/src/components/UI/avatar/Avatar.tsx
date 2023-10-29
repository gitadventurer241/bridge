import React from "react";
import { Avatar as AntAvatar } from "antd";

interface AvatarProps {
  firstName?: string;
  lastName?: string;
  imageSrc?: string;
  size?: "large" | "small" | "default" | number;
  handleProfileClick?: () => void;
}

const Avatar: React.FC<AvatarProps> = ({
  firstName = "",
  lastName = "",
  imageSrc,
  size,
  handleProfileClick,
}) => {
  const initials = `${firstName?.charAt(0)}${lastName?.charAt(0)}`;

  return (
    <>
      <AntAvatar
        onClick={handleProfileClick}
        style={{
          backgroundColor: `var(--blue-darker)`,
          verticalAlign: "middle",
          cursor: "pointer",
        }}
        size={size}
        src={imageSrc}
      >
        {initials}
      </AntAvatar>
    </>
  );
};

export default Avatar;
