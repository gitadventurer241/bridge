import { IconMapPin, IconUsers, IconWorldWww } from "@tabler/icons-react";
import { Button } from "../../../../UI/button/Button";
import { CardContainer } from "../../../../UI/container/CardContainer";
import { SkillsLevelGuide } from "../../../../shared/skillsLevelGuide/SkillsLevelGuide";
import Avatar from "../../../../UI/avatar/Avatar";
import ApplyModal from "../../applyModal/ApplyModal";
import { Labels } from "../../../../UI/labels/Label";
import { useState } from "react";

import styling from "./DetailsTab.module.css";
import { Candidate, Company, Job } from "../../../../../types/types";
import { useNavigate } from "react-router-dom";

interface DetailsTabProps {
  jobData: Job;
  companyData: Company | undefined;
  candidate: Candidate | undefined;
  getInfo: (any: any) => void;
  id: string | undefined;
  userType?: string;
}

const DetailsTab: React.FC<DetailsTabProps> = ({
  jobData,
  companyData,
  candidate,
  getInfo,
  id,
  userType,
}) => {
  const companyIconSize = 15;

  const navigate = useNavigate();

  const [isApplyModalOpen, setApplyModalOpen] = useState(false);

  const toggleApplyModal = () => {
    setApplyModalOpen(!isApplyModalOpen);
    getInfo(id ?? "");
  };

  const isApplied = () => {
    const requestedJobs = candidate?.requested_jobs;
    if (requestedJobs) {
      return requestedJobs.includes(jobData?.id);
    }
    return false;
  };

  return (
    <>
      {/* Containers */}
      <CardContainer className={styling.cardCont}>
        <div className={styling.skillsContainer}>
          <div className={styling.sideSkills}>
            <h1 className={styling.titles}>Hard Skills</h1>

            <div className={styling.labelDiv}>
              {jobData?.skills?.map((skill, index) => (
                <Labels
                  key={`technical_${index}`}
                  labelName={skill?.skill_name}
                  isSkill={true}
                  skillLevel={skill?.skill_level}
                  disableCloseIcon={true}
                  customClass={styling.label}
                />
              ))}
            </div>
          </div>

          <div className={styling.sideSkills}>
            <h1 className={styling.titles}>Soft Skills</h1>

            <div className={styling.labelDiv}>
              {jobData?.soft_skills?.map((skill, index) => (
                <Labels
                  key={`technical_${index}`}
                  labelName={skill}
                  isSkill={true}
                  disableCloseIcon={true}
                  customClass={styling.label}
                />
              ))}
            </div>
          </div>
        </div>
        <SkillsLevelGuide />
      </CardContainer>

      {/* Job Description */}
      <CardContainer className={styling.cardCont}>
        <h1 className={styling.titles}>Job Description</h1>
        <h2 className={styling.h2Title}>What will you do?</h2>
        <p>{jobData?.description}</p>
      </CardContainer>

      {/* Accepting applications */}
      {userType === "candidate" && (
        <CardContainer className={`${styling.cardCont} ${styling.applyDiv}`}>
          <h1 className={styling.titles}>Accepting applications</h1>
          <Button
            className={styling.applyButton}
            onClick={toggleApplyModal}
            disabled={isApplied()}
          >
            {isApplied()
              ? "You have already shown interest in this position"
              : "Show your interest in the position"}
          </Button>
        </CardContainer>
      )}

      <ApplyModal
        isApplyModalOpen={isApplyModalOpen}
        company={companyData}
        jobId={jobData?.id}
        candidate={candidate}
        callback={toggleApplyModal}
      />

      <CardContainer className={styling.cardCont}>
        <h1 className={styling.titles}>Company details</h1>
        <div className={`${styling.rowEnd} ${styling.allWidth}`}>
          <div className={styling.row}>
            <Avatar firstName={companyData?.company_name} size={50} />
            <div>
              {companyData?.company_name ? (
                <h3 className={styling.companyName}>
                  {companyData?.company_name}
                </h3>
              ) : (
                <h3 className={styling.companyName}>Company</h3>
              )}

              <div className={styling.row}>
                <IconMapPin size={companyIconSize} />
                {companyData?.address ? (
                  <p>{companyData?.address}</p>
                ) : (
                  <p>Basel, CH</p>
                )}
                <p>|</p>
                <div className={styling.row}>
                  <IconUsers size={companyIconSize} />
                  {companyData?.company_size ? (
                    <p>{companyData?.company_size}</p>
                  ) : (
                    <p>100-200</p>
                  )}
                </div>
                <p>|</p>
                <a
                  href={companyData?.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <IconWorldWww size={companyIconSize} color="black" />
                </a>
              </div>
            </div>
          </div>
          <div className={styling.row}>
            <Button
              className={styling.companyButton}
              onClick={() => {
                navigate(`/company/${companyData?.user_id}`);
              }}
            >
              View company
            </Button>
          </div>
        </div>
        <div>
          <h2 className={styling.h2Title}>About us</h2>
          <p>{companyData?.company_description}</p>
        </div>
      </CardContainer>
    </>
  );
};

export default DetailsTab;
