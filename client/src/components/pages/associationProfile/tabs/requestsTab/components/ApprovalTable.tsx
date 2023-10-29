import { Space } from "antd";
import { Association, Candidate, TableRecord } from "../../../../../../types/types";
import Table from "../../../../../UI/table/Table";
import styling from "./ApprovalTable.module.scss";
import { useEffect, useState } from "react";
import {
  getCandidateById,
  updateCandidateById,
} from "../../../../../../api/candidates";
import { updateAssociationById } from "../../../../../../api/associations";

const RequestsComponent = ({ association }: { association: Association }) => {
  const [candidates, setCandidates] = useState([] as Candidate[]);

  const fetchCandidates = async () => {
    const requests = association?.requests || [];

    // Create an array of promises for fetching candidate data
    const candidatePromises = requests.map(async (request) => {
      const candidateId = request?.candidateId;
      const candidate = await getCandidateById(candidateId);
      return candidate;
    });

    // Wait for all promises to resolve and set the candidates state
    Promise.all(candidatePromises)
      .then((candidateData) => {
        setCandidates(candidateData);
      })
      .catch((error) => {
        console.error("Error fetching candidate data: ", error);
      });
  };

  const removeCandidateFromRequests = async (candidateId: string) => {
    const updatedRequests = association?.requests.filter(
      (request) => request?.candidateId !== candidateId
    );

    // send updated requests to backend
    try {
      const response = await updateAssociationById(association?.user_id, {
        requests: updatedRequests,
      });
      console.log(response);
    } catch (error) {
      console.error("Error updating association: ", error);
    }
    // Update the candidates and association state
    setCandidates(
      candidates.filter((candidate) => candidate?.user_id !== candidateId)
    );
  };

  const onAccept = async (record: TableRecord) => {
    // Find the candidate with the given candidateId
    const candidate = candidates.find((c) => c.user_id === record?.candidateId);

    if (candidate) {
      // Create a new object to add to initiatives_accepted
      const newAcceptedInitiative = {
        initiativeName: record?.project, // Replace with the actual title
        associationId: record?.associationId, // Replace with the actual association ID
      };

      // Clone the existing initiatives_accepted array and push the new object
      const updatedInitiativesAccepted = [
        ...(candidate.initiatives_accepted || []),
        newAcceptedInitiative,
      ];

      try {
        const response = await updateCandidateById(record?.candidateId, {
          initiatives_accepted: updatedInitiativesAccepted,
        });
        console.log(response);
        // Remove the candidate from the requests array
        removeCandidateFromRequests(record?.candidateId);
      } catch (error) {
        console.error("Error updating candidate: ", error);
      }
    } else {
      console.error("Candidate not found");
    }
  };

  const onDecline = async (candidateId: string) => {
    // Remove the candidate from the requests array
    removeCandidateFromRequests(candidateId);
  };

  useEffect(() => {
    fetchCandidates();
  }, [association]);

  const headerRequests = [
    {
      title: "Candidate",
      dataIndex: "candidate",
      key: "candidate",
    },
    {
      title: "Project / Certification",
      dataIndex: "project",
      key: "project",
    },
    {
      title: "Approval",
      key: "approval",
      render: (_: any, record: any) => (
        <Space>
          <button className={styling.accept} onClick={() => onAccept(record)}>
            Accept
          </button>
          <button
            className={styling.reject}
            onClick={() => onDecline(record?.candidateId)}
          >
            Decline{" "}
          </button>
        </Space>
      ),
    },
  ];

  const data = candidates.map((candidate, index) => ({
    key: String(index),
    candidate: `${candidate?.first_name} ${candidate?.last_name}` || "N/A",
    candidateId: candidate?.user_id,
    project: association?.requests[index]?.initiativeName || "N/A",
    associationId: association?.user_id,
  }));

  return <Table columns={headerRequests} data={data} />;
};

export default RequestsComponent;
