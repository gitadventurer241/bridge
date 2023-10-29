import React from "react";
import { ConfigProvider, Dropdown } from "antd";
import "./Dropdown.css";

interface DropdownProps {
  icon: any;
  items: ItemType[];
  width?: number;
  trigger?: ("click" | "hover" | "contextMenu")[] | undefined;
  placement:
    | "topLeft"
    | "topCenter"
    | "topRight"
    | "bottomLeft"
    | "bottomCenter"
    | "bottomRight"
    | "top"
    | "bottom";
}

interface ItemType {
  key: string;
  label: React.ReactNode;
  width?: number;
  onClick?: () => void;
}

const DropdownComponent: React.FC<DropdownProps> = ({
  icon,
  items,
  width,
  placement,
  trigger,
}) => (
  <ConfigProvider
    theme={{
      components: {
        Dropdown: {
          zIndexPopup: 1000,
        },
      },
    }}
  >
    <Dropdown
      menu={{ items }}
      placement={placement}
      overlayStyle={{ width: width }}
      trigger={trigger}
    >
      {icon}
    </Dropdown>
  </ConfigProvider>
);

export { DropdownComponent };
