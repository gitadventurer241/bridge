import styling from "./Button.module.css";
// ButtonProps
export interface ButtonProps {
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  icon?: React.ReactNode;
}

// Button
const Button = ({
  children,
  onClick,
  disabled,
  type,
  className,
  icon,
}: ButtonProps) => {
  return (
    <>
      <button
        onClick={onClick}
        disabled={disabled}
        type={type}
        className={className + ` ${styling.button}`}
        style={{ height: "3.5rem" }}
      >
        {children}
      </button>
    </>
  );
};

export { Button };
