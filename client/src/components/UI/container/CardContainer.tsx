import styling from "./CardContainer.module.css";
import React from "react";

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  cssProperties?: React.CSSProperties;
}

const CardContainer: React.FC<CardContainerProps> = ({
  children,
  className,
}) => {
  return <div className={`${styling.cardContainer} ${className}`}>{children}</div>;
};

export { CardContainer };
