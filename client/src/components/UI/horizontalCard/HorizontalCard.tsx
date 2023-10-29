import styling from "./HorizontalCard.module.css";
import { Button } from "../button/Button";
import { Button as AntButton } from "antd";
import Avatar from "../avatar/Avatar";

interface HorizontalCardProps {
  avatar?: boolean;
  button?: string;
  firstName?: string;
  lastName?: string;
  title?: string;
  subtitle?: string | JSX.Element;
  isButtonDisabled?: boolean;
  deleteEdit?: boolean;
  onClick?: () => void;
  onTitleClick?: () => void;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
}

//TODO: add title and description props
const HorizontalCard: React.FC<HorizontalCardProps> = ({
  avatar,
  button,
  firstName,
  lastName,
  title,
  subtitle,
  isButtonDisabled = false,
  deleteEdit,
  onClick,
  onTitleClick,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className={styling.container}>
      {avatar && <Avatar firstName={firstName} lastName={lastName} size={70} />}

      <div className={styling.text}>
        <h2
          className={styling.title}
          style={{ cursor: "pointer" }}
          onClick={onTitleClick}
        >
          {title}
        </h2>
        <p className={styling.subtitle}>{subtitle}</p>
      </div>

      {!isButtonDisabled && button && (
        <Button className={styling.button} onClick={onClick}>
          {button}
        </Button>
      )}

      {deleteEdit && (
        <div className={styling.buttons}>
          <AntButton
            className={styling.antButton}
            onClick={onEditClick}
            type="primary"
          >
            Edit
          </AntButton>
          <AntButton
            className={styling.antButton}
            onClick={onDeleteClick}
            type="default"
            danger
          >
            Delete
          </AntButton>
        </div>
      )}
    </div>
  );
};

export { HorizontalCard };
