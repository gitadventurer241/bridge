import { useEffect, useState } from "react";
import { CardContainer } from "../../../../UI/container/CardContainer";
import { ContentBlock } from "../../../../UI/container/SectionContainer";
import { Labels } from "../../../../UI/labels/Label";
import {
  Candidate,
  Experience,
  Job,
  PackageAccepted,
  Section,
} from "../../../../../types/types";
import styling from "./CandidateResumeTab.module.scss";
import { IconTags } from "@tabler/icons-react";
import { SkillsLevelGuide } from "../../../../shared/skillsLevelGuide/SkillsLevelGuide";
import { RequestAccess } from "../../modal/RequestAccess";
import {
  transformCandidateDocs,
  transformCandidateJobPref,
  transformExperience,
} from "../../../helpers/helper";
import { Button } from "../../../../UI/button/Button";
import { ProgressBarComponent } from "../../../../UI/progressbar/ProgressBarComponent";
import { allCategories } from "../../../helpers/helper";

interface CandidateResumeTabProps {
  candidate: Candidate;
  matchingJobs: Job[];
  userType?: string;
}

const CandidateResumeTab: React.FC<CandidateResumeTabProps> = ({
  candidate,
  matchingJobs,
  userType,
}) => {
  const candidateId = candidate?.user_id;
  const companyId = JSON.parse(localStorage.getItem("auth") || "{}").user?.id;
  const [sectionsExperience, setSectionsExperience] = useState([] as Section[]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPackageVisible, setIsPackageVisible] = useState(false);
  const [sectionsJobSearchPref, setSectionsJobSearchPref] = useState([] as any);
  const [sectionDocuments, setSectionDocuments] = useState([] as Section[]);
  const [companyVisibleInfo, setCompanyVisibleInfo] = useState([] as string[]);

  useEffect(() => {
    // read if access from local storage
    if (userType === "company") {
      if (candidate) {
        const transformedExperience = transformExperience(
          candidate.experience as Experience[]
        );
        const transformedVisibleInfo = transformCandidateJobPref(candidate);
        const transformedData = transformCandidateDocs(candidate);
        setSectionDocuments(transformedData);
        setSectionsJobSearchPref(transformedVisibleInfo);
        setSectionsExperience(transformedExperience);
      }

      const packageCandidateAccepted = candidate?.package_accepted as
        | PackageAccepted[]
        | undefined;

      if (packageCandidateAccepted && packageCandidateAccepted.length > 0) {
        setIsPackageVisible(true);
        // Find company id in package accepted
        const matchingObject = packageCandidateAccepted.find(
          (obj) => obj.companyId === companyId
        );

        if (matchingObject) {
          const visibleInfoArray: string[] = matchingObject.visible_info;
          setCompanyVisibleInfo(visibleInfoArray);
        } else {
          console.log("No matching object found for the specified companyId.");
        }
      } else {
        setIsPackageVisible(false);
      }
    } else {
      setIsPackageVisible(true);
    }
  }, [candidate]);

  const requestAccess = () => {
    setIsModalVisible(true);
  };

  const isJobPrefVisible = () => {
    if (userType === "company") {
      return companyVisibleInfo.includes("Job Preferences");
    } else {
      return true;
    }
  };
  const isLanguagesVisible = () => {
    if (userType === "company") {
      return companyVisibleInfo.includes("Languages");
    } else {
      return true;
    }
  };
  const isDocumentsVisible = () => {
    if (userType === "company") {
      return companyVisibleInfo.includes("Documents");
    } else {
      return true;
    }
  };

  return (
    <div className={styling.main}>
      {/* Assosiactions */}
      <div className={styling.row}>
        <CardContainer className={styling.associationContainer}>
          <h1 className={styling.margin}>Associations</h1>
          <div className={styling.associations}>
            {candidate?.associations &&
              candidate?.associations?.map((label, index) => (
                <Labels
                  key={index}
                  icon={<IconTags />}
                  labelName={label}
                  disableCloseIcon={true}
                  customClass={styling.label}
                />
              ))}
          </div>
        </CardContainer>

        {/* Type of jobs */}
        <CardContainer className={styling.cardContainerTypeOfJobs}>
          <h1 className={styling.margin}>Type of jobs you're looking for</h1>
          <div className={styling.typeOfJobs}>
            {candidate?.preferred_jobs &&
              candidate?.preferred_jobs?.map((job, index) => (
                <Labels
                  key={index}
                  icon={<IconTags />}
                  labelName={job}
                  disableCloseIcon={true}
                  customClass={styling.label}
                />
              ))}
          </div>
        </CardContainer>
      </div>

      {/* Skills */}
      <CardContainer className={styling.cardContainerSkills}>
        <div>
          <h1 className={`${styling.skillsTitle} ${styling.margin}`}>Skills</h1>
          <SkillsLevelGuide />
          <div className={styling.skills}>
            {candidate?.skills &&
              candidate?.skills?.map((label, index) => (
                <Labels
                  key={index}
                  icon={<IconTags />}
                  labelName={label.skill_name}
                  disableCloseIcon={true}
                  customClass={styling.label}
                  isSkill={true}
                  skillLevel={label.skill_level}
                />
              ))}
          </div>
        </div>
      </CardContainer>

      <div className={styling.row}>
        {/* Values */}
        <CardContainer className={styling.cardContainerValues}>
          <div>
            <h1 className={styling.margin}>Values</h1>
            <div className={styling.values}>
              {candidate?.values &&
                candidate?.values?.map((label, index) => (
                  <Labels
                    key={index}
                    icon={<IconTags />}
                    labelName={label}
                    disableCloseIcon={true}
                    customClass={styling.label}
                  />
                ))}
            </div>
          </div>
        </CardContainer>

        {/* Experience */}
        <CardContainer className={styling.cardContainerExperiences}>
          <div>
            <h1 className={styling.margin}>Experience</h1>
            {sectionsExperience && (
              <ContentBlock sections={sectionsExperience} />
            )}
          </div>
        </CardContainer>
      </div>
      {!isPackageVisible ? (
        <div>
          {/* Request package */}
          <CardContainer className={styling.requestPackage}>
            <h1 className={styling.requestAccessTitle}>
              Request application package
            </h1>
            <Button className={styling.applyButton} onClick={requestAccess}>
              Request access
            </Button>
            <RequestAccess
              candidateId={candidateId}
              show={isModalVisible}
              setShow={setIsModalVisible}
              jobs={matchingJobs}
            />
          </CardContainer>

          {/* Package */}
          <div className={styling.jobPrefDiv}>
            {/* Job search preferences */}
            <CardContainer
              className={`${styling.jobPrefContainer} ${styling.blurredText}`}
            >
              <div className={styling.profileCompletedEditIcon}>
                <h1 className={styling.margin}>Job Search Preferences</h1>
              </div>
              <div className={styling.visibleSection}>
                <ContentBlock sections={sectionsJobSearchPref} />
              </div>
            </CardContainer>

            <div className={styling.oneRow}>
              {/* Laguages */}
              <CardContainer
                className={`${styling.lowerContainer} ${styling.blurredText}`}
              >
                <div className={styling.profileCompletedEditIcon}>
                  <h1 className={styling.margin}>Languages</h1>
                </div>
                <ProgressBarComponent
                  customClass={styling.padding}
                  candidate={candidate}
                />
              </CardContainer>

              {/* Uploaded documents */}
              <CardContainer
                className={`${styling.lowerContainer} ${styling.blurredText}`}
              >
                <div className={styling.profileCompletedEditIcon}>
                  <h1 className={styling.margin}>Uploaded documents</h1>
                </div>
                <ContentBlock
                  customClass={styling.padding}
                  sections={sectionDocuments}
                />
              </CardContainer>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* Package */}
          <div className={styling.jobPrefDiv}>
            {/* Job search preferences */}
            <CardContainer
              className={
                isJobPrefVisible()
                  ? styling.jobPrefContainer
                  : styling.jobPrefBlur
              }
            >
              <div className={styling.profileCompletedEditIcon}>
                <h1 className={styling.margin}>Job Search Preferences</h1>
              </div>
              <div className={styling.visibleSection}>
                <ContentBlock sections={sectionsJobSearchPref} />
              </div>
            </CardContainer>

            <div className={styling.oneRow}>
              {/* Laguages */}
              <CardContainer
                className={
                  isLanguagesVisible()
                    ? styling.lowerContainer
                    : styling.blurredText
                }
              >
                <div className={styling.profileCompletedEditIcon}>
                  <h1 className={styling.margin}>Languages</h1>
                </div>
                <ProgressBarComponent
                  customClass={styling.padding}
                  candidate={candidate}
                />
              </CardContainer>

              {/* Uploaded documents */}
              <CardContainer
                className={
                  isDocumentsVisible()
                    ? styling.lowerContainer
                    : styling.blurredText
                }
              >
                <div className={styling.profileCompletedEditIcon}>
                  <h1 className={styling.margin}>Uploaded documents</h1>
                </div>
                <ContentBlock
                  customClass={styling.padding}
                  sections={sectionDocuments}
                />
              </CardContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { CandidateResumeTab };
