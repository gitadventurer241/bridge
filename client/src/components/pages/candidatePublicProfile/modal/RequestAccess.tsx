import { Modal, Button, Select } from "antd";
import React from "react";
import { toast } from "react-toastify";
import { Job } from "../../../../types/types";
import TextArea from "antd/es/input/TextArea";
import { getCandidateById, updateCandidateById } from "../../../../api/candidates";
import { getCompanyById } from "../../../../api/companies";
const { Option } = Select;

interface RequestAccessProps {
  candidateId: string;
  show: boolean;
  setShow: (arg: boolean) => void;
  jobs: Job[];
}

const RequestAccess: React.FC<RequestAccessProps> = ({
  candidateId,
  show,
  setShow,
  jobs,
}) => {
  const [selectedJob, setSelectedJob] = React.useState<Job | null>(null);
  const companyId = JSON.parse(localStorage.getItem("auth") || "{}").user?.id;

  const onCancel = () => {
    setShow(false);
  };

  const onRequestAccess = async () => {
    toast.success(`Access requested`, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
    const company = await getCompanyById(companyId);
    const existingCandidateData = await getCandidateById(candidateId);

    // new request object
    const newRequest = {
      job_id: selectedJob?.id || "",
      job_title: selectedJob?.title || "",
      company_id: companyId,
      company_name: company?.company_name,
    };

    // Append the new request to the existing package_requested
    const updatedPackageRequested = [
      ...(existingCandidateData?.package_requested || []),
      newRequest,
    ];

    // Update the candidate's data with the modified package_requested array
    const updatedCandidate = await updateCandidateById(candidateId, {
      package_requested: updatedPackageRequested,
    });
    setShow(false);
  };

  return (
    <>
      <Modal
        open={show}
        onCancel={onCancel}
        footer={[
          <Button key="close" onClick={onCancel}>
            Close
          </Button>,
          <Button key="request" type="primary" onClick={onRequestAccess}>
            Request Access
          </Button>,
        ]}
      >
        <h1>Contact Candidate</h1>
        <p>
          Candidates personal information is kept private until you show
          interest, would you like to request access to an application package?
        </p>
        <Select
          style={{ width: "100%", marginBottom: "1rem" }}
          placeholder="Select a job"
          onChange={(value) => {
            const job = jobs.find((job) => job.id === value);
            setSelectedJob(job || null);
          }}
        >
          {jobs?.map((job, index) => (
            <Option value={job.id} key={index}>
              {job.title}
            </Option>
          ))}
        </Select>
        <TextArea
          placeholder="Message to a candidate (optional)"
          autoSize={{ minRows: 3, maxRows: 5 }}
        />
      </Modal>
    </>
  );
};

export { RequestAccess };
