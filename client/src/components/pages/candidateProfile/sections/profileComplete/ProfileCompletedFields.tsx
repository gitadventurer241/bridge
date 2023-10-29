import { IconCircleCheck, IconProgressAlert } from "@tabler/icons-react";
import styling from "./ProfileCompletedFields.module.css";
import { Button } from "../../../../UI/button/Button";

interface ProfileCompletedFieldsProps {
  isCompleted: boolean;
  category: string;
  onAddClick?: () => void;
}

const ProfileCompletedFields = ({
  isCompleted,
  category,
  onAddClick,
}: ProfileCompletedFieldsProps) => {
  return (
    <>
      <div className={styling.profileCompleted}>
        <div className={styling.profileCompletedIcon}>
          {isCompleted ? (
            <IconCircleCheck color="green" />
          ) : (
            <IconProgressAlert color="#FAAD14" />
          )}
          <p className={styling.profileCompletedText}>{category}</p>
        </div>
        <div hidden={isCompleted}>
          <Button
            className={styling.profileUncompletedButton}
            onClick={onAddClick}
          >
            Add
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfileCompletedFields;
