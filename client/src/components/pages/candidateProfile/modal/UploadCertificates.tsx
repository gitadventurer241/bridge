import React from "react";
import { Input, Button, Upload } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { UploadFile } from "antd/lib/upload/interface";
import { Candidate } from "../../../../types/types";
import styling from "./UploadCertificates.module.css";

interface CertificatesProps {
  candidate: Candidate;
  certificates: { name: string; reference: string }[] | null;
  setCertificates: (arg: { name: string; reference: string }[] | null) => void;
  candidateCertificates: { name: string; reference: string }[] | null;
  setCandidateCertificates: (
    arg: { name: string; reference: string }[] | null
  ) => void;
  currentCertificateTitle: string | null | undefined;
  setCurrentCertificateTitle: (arg: string | null) => void;
}

const Certificates: React.FC<CertificatesProps> = ({
  candidate,
  certificates,
  candidateCertificates,
  setCandidateCertificates,
  setCertificates,
  setCurrentCertificateTitle,
  currentCertificateTitle,
}) => {
  const cvProps = {
    onRemove: () => {
      setCertificates(null);
      setCurrentCertificateTitle(null);
    },
    beforeUpload: (file: UploadFile) => {
      if (!currentCertificateTitle) {
        return false;
      }
      setCertificates([
        ...certificates!,
        { name: currentCertificateTitle, reference: file.name },
      ]);
      setCandidateCertificates([
        ...candidateCertificates!,
        { name: currentCertificateTitle, reference: file.name },
      ]);
      setCurrentCertificateTitle(null);
      return false;
    },
  };

  const deleteCertificate = (certificateReference: string | null) => {
    if (candidate) {
      const deletedCertificate = candidate?.certificates?.filter(
        (certificate) => certificate?.reference !== certificateReference
      );
      setCandidateCertificates(deletedCertificate as any);
      setCertificates(deletedCertificate as any);
    }
  };

  return (
    <>
      {/* Show CV */}

      {candidateCertificates ? (
        <>
          <h3>Your Certificates:</h3>
          <div>
            {candidateCertificates?.map((certificate, index) => (
              <div key={certificate.name}>
                <p>
                  <strong>Certificate Name:</strong> {certificate.name}
                </p>
                <p>
                  <strong>Reference:</strong> {certificate.reference}
                </p>
                <Button onClick={() => deleteCertificate(certificate.reference)}>
                  Delete Certificate
                </Button>
              </div>
            ))}
          </div>

          <h3>Upload a new Certificate:</h3>
          <Input
            placeholder="Certificate Name"
            value={currentCertificateTitle!}
            onChange={(e) => setCurrentCertificateTitle(e.target.value)}
          />
          <Upload {...cvProps} showUploadList={false}>
            <Button
              icon={<UploadOutlined />}
              className={styling.uploadButton}
              disabled={
                currentCertificateTitle === null ||
                currentCertificateTitle === ""
              }
            >
              Upload Certificate
            </Button>
          </Upload>
        </>
      ) : (
        <>
          <h3>Upload your Certificate:</h3>
          <Input
            placeholder="Certificate Name"
            value={currentCertificateTitle!}
            onChange={(e) => setCurrentCertificateTitle(e.target.value)}
          />
          <Upload {...cvProps} showUploadList={false}>
            {certificates ? (
              <p>{certificates[0].name}</p>
            ) : (
              <Button
                icon={<UploadOutlined />}
                className={styling.uploadButton}
                disabled={
                  currentCertificateTitle === null ||
                  currentCertificateTitle === ""
                }
              >
                Upload Certificate
              </Button>
            )}
          </Upload>
        </>
      )}
    </>
  );
};

export { Certificates };
