import { Space, Table } from "antd";
import { CardContainer } from "../../../UI/container/CardContainer";
import { useEffect, useState } from "react";
import styling from "./ApplicationRequests.module.scss";
import ToggleModal from "../../../shared/toggleModal/ToggleModal";
import { allCategories } from "../../helpers/helper";
import { Candidate } from "../../../../types/types";
import {
  getCandidateById,
  updateCandidateById,
} from "../../../../api/candidates";

interface applicationRequest {
  key: number;
  position: string;
  company: string;
  companyId?: string;
}

const ApplicationRequests = () => {
  const [tableData, setTableData] = useState([] as applicationRequest[]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStrings, setSelectedStrings] = useState<boolean[]>([
    true,
    true,
    true,
    true,
  ]);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [candidate, setCandidate] = useState<Candidate | null>({} as Candidate);

  const fetchInfo = async () => {
    const user_type = JSON.parse(localStorage.getItem("auth") || "{}").user
      ?.user_type;
    if (user_type !== "candidate") return;
    const candidateId = JSON.parse(localStorage.getItem("auth") || "{}").user
      ?.id;
    const candidate = await getCandidateById(candidateId);
    setCandidate(candidate);

    if (Array.isArray(candidate?.package_requested)) {
      const newTableData = candidate?.package_requested?.map(
        (item: any, index: number) => {
          return {
            key: index,
            position:
              item?.job_title !== ""
                ? item?.job_title
                : "No position specified",
            company: item?.company_name,
            companyId: item?.company_id,
          };
        }
      );
      setTableData(newTableData);
    } else {
      console.log(
        "package_requested is not an array:",
        candidate?.package_requested
      );
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const handleOk = async (enabledStrings: string[]) => {
    setIsModalOpen(false);
    if (selectedRecord) {
      // Filter out the selected record from tableData
      const updatedData = tableData?.filter(
        (item) => item.key !== selectedRecord.key
      );
      setTableData(updatedData);

      // check if **package_accepted** exists
      const existingCompanyIndex = candidate?.package_accepted?.findIndex(
        (item: any) => item.companyId === selectedRecord.companyId
      );

      if (existingCompanyIndex !== undefined && existingCompanyIndex !== -1) {
        // Clone the candidate and the specific company entry
        const updatedCandidate = {
          ...candidate,
          package_accepted: [...(candidate?.package_accepted || [])],
        };

        // Update the specific company entry with the new visible_info
        updatedCandidate.package_accepted[existingCompanyIndex].visible_info =
          enabledStrings;

        // Update the candidate's data
        await updateCandidateById(candidate?.user_id!, {
          package_accepted: updatedCandidate.package_accepted,
        });
      } else {
        // Create a modified package_accepted array with the selectedRecord
        const updatedPackageAccepted = [
          ...(candidate?.package_accepted || []),
          {
            ...selectedRecord,
            visible_info: enabledStrings,
          },
        ];

        // Create a modified package_requested array without the selectedRecord
        const updatedPackageRequested = candidate?.package_requested?.filter(
          // filter out the selected record
          (item) => item.key === selectedRecord.key
        );
        if (updatedPackageRequested && updatedPackageAccepted) {
          const updatedCandidate = await updateCandidateById(
            candidate?.user_id!,
            {
              package_requested: updatedPackageRequested,
              package_accepted: updatedPackageAccepted,
            }
          );
        }
      }

      setSelectedRecord(null);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedRecord(null);
  };

  const handleToggle = (index: number) => {
    const updatedSelectedStrings = [...selectedStrings];
    updatedSelectedStrings[index] = !selectedStrings[index];
    setSelectedStrings(updatedSelectedStrings);
  };

  const handleReview = (record: any) => {
    setSelectedRecord(record); // Set the selected record
    setIsModalOpen(true);
  };

  const handleReject = async (record: any) => {
    // Filter out the row with the rejected company
    const updatedData = tableData.filter((item) => item.key !== record.key);
    // update the candidate data
    setTableData(updatedData);

    // Create a modified package_requested array without the rejected record
    const updatedPackageRequested = candidate?.package_requested?.filter(
      (item: any) => item.key !== record.key
    );

    // Update the candidate's data with the modified package_requested array
    if (updatedPackageRequested) {
      const updatedCandidate = await updateCandidateById(candidate?.user_id!, {
        package_requested: updatedPackageRequested,
      });
    }
  };

  const headerRequests = [
    {
      title: "Position",
      dataIndex: "position",
      key: "position",
    },
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Approval",
      key: "approval",
      render: (_: any, record: any) => (
        <Space>
          <button
            className={styling.accept}
            onClick={() => handleReview(record)}
          >
            Review
          </button>
          <button
            className={styling.reject}
            onClick={() => handleReject(record)}
          >
            Decline
          </button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <CardContainer className={styling.requests}>
        <h1 className={styling.titleTables}>Application package requests</h1>
        <Table columns={headerRequests} dataSource={tableData} />
      </CardContainer>
      <ToggleModal
        visible={isModalOpen}
        allCategories={allCategories}
        selectedStrings={selectedStrings}
        title="Application package"
        subtitle="The Dream company has requested your application package for job Developer, what would you like to share with them?"
        buttonText="Share your application package"
        onToggle={handleToggle}
        onAcceptWithEnabledStrings={handleOk}
        onCancel={handleCancel}
      />
    </>
  );
};

export default ApplicationRequests;
