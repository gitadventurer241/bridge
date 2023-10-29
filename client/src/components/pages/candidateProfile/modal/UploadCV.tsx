import { Upload } from "antd";
import { Candidate } from "../../../../types/types";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib/upload/interface";

interface CVProps {
  candidate: Candidate;
  cvReference: string | null | undefined;
  setCVReference: (arg: string | null) => void;
  cvFile: string | null | undefined;
  setCvFile: (arg: string | null) => void;
}

const CV: React.FC<CVProps> = ({
  cvFile,
  setCvFile,
  setCVReference,
  cvReference,
}) => {
  const cvProps = {
    onRemove: () => {
      setCvFile(null);
    },
    beforeUpload: (file: UploadFile) => {
      setCvFile(file.name);
      return false;
    },
  };

  const deleteCV = () => {
    setCvFile(null);
    setCVReference(null);
  };

  return (
    <>
      {/* Show CV */}
      {cvReference ? (
        <>
          <h3>Your CV:</h3>
          <p>
            <strong>Reference:</strong> {cvReference}
          </p>

          <Button onClick={deleteCV}>Delete CV</Button>

          <h3>Upload a new CV:</h3>
          <Upload {...cvProps} showUploadList={false}>
            {cvFile ? (
              <p>{cvFile}</p>
            ) : (
              <Button icon={<UploadOutlined />}>Upload CV</Button>
            )}
          </Upload>
        </>
      ) : (
        <>
          <h3>Upload your CV:</h3>
          <Upload {...cvProps} showUploadList={false}>
            {cvFile ? (
              <p>{cvFile}</p>
            ) : (
              <Button icon={<UploadOutlined />}>Upload CV</Button>
            )}
          </Upload>
        </>
      )}
    </>
  );
};

export { CV };
