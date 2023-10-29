import { useEffect, useState } from "react";

import Avatar from "../../UI/avatar/Avatar";

import { Labels } from "../../UI/labels/Label";
import { EditSkills } from "./modal/EditSkills";
import { EditValues } from "./modal/EditValues";
import { EditInput } from "./modal/EditInput";
import { EditLanguages } from "./modal/EditLanguages";
import { EditTypeOfJobs } from "./modal/EditTypeOfJobs";
import { EditExperience } from "./modal/EditExperience";
import { EditJobSearchPref } from "./modal/EditJobSearchPref";
import {
  allCategories,
  allTypeOfJob,
  fieldsToDisplayContactInfo,
  fieldsToDisplayProfile,
  transformCandidateDocs,
  transformCandidateJobPref,
  transformExperience,
} from "../helpers/helper";
import { CardContainer } from "../../UI/container/CardContainer";
import { ProgressBarComponent } from "../../UI/progressbar/ProgressBarComponent";
import { ContentBlock } from "../../UI/container/SectionContainer";
import { ProfileComplete } from "./sections/profileComplete/ProfileComplete";
import {
  IconEdit,
  IconMapPin,
  IconBrandLinkedin,
  IconWorldWww,
  IconTags,
  IconSpy,
} from "@tabler/icons-react";
import { DocumentUploadModal } from "./modal/EditUploadDocuments";
import { getCandidateById, updateCandidateById } from "../../../api/candidates";

import { Candidate, AllSkill, AllValues } from "../../../types/types";

import styling from "./CandidateProfile.module.css";
import { SkillsLevelGuide } from "../../shared/skillsLevelGuide/SkillsLevelGuide";
import ToggleModal from "../../shared/toggleModal/ToggleModal";
import { getAllSkills } from "../../../api/skills";
import { getAllValues } from "../../../api/values";
import Spinner from "../../UI/spinner/Spinner";

const CandidateProfile = () => {
  // State
  const [candidate, setCandidate] = useState({} as Candidate);
  const [sectionDocuments, setSectionDocuments] = useState([] as any);
  const [sectionsJobSearchPref, setSectionsJobSearchPref] = useState([] as any);
  const [sectionsExperience, setSectionsExperience] = useState([] as any);
  const [isCompleteProfile, setIsCompleteProfile] = useState(false);
  // Is edit
  const [isEditContactInfo, setIsEditContactInfo] = useState(false);
  const [isEditLanguages, setIsEditLanguages] = useState(false);
  const [isProfileEdit, setIsProfileEdit] = useState(false);
  const [isJobSearchPrefEdit, setisJobSearchPrefEdit] = useState(false);
  const [isSkillsEdit, setIsSkillsEdit] = useState(false);
  const [isValuesEdit, setIsValuesEdit] = useState(false);
  const [isTypeOfJobsEdit, setIsTypeOfJobsEdit] = useState(false);
  const [isExperienceEdit, setIsExperienceEdit] = useState(false);
  const [isDocumentsEdit, setIsDocumentsEdit] = useState(false);
  // loading
  const [isLoading, setIsLoading] = useState(true);

  const [allSkills, setAllSkills] = useState<AllSkill[]>([]);
  const [allSoftSkills, setAllSoftSkills] = useState<string[]>([]);
  const [allValues, setAllValues] = useState([]);
  const [allTypeOfJobs, setAllTypeOfJobs] = useState([]);
  // count null categories
  const [countNullCategories, setCountNullCategories] = useState<
    Record<string, number>
  >({});

  // toggle
  const [showToggleModal, setShowToggleModal] = useState(false);
  const [selectedStrings, setSelectedStrings] = useState<boolean[]>([
    true,
    true,
    true,
    true,
  ]);
  const handleToggle = (index: number) => {
    const updatedSelectedStrings = [...selectedStrings];
    updatedSelectedStrings[index] = !selectedStrings[index];
    setSelectedStrings(updatedSelectedStrings);
  };

  const fetchCandidate = async () => {
    const auth = JSON.parse(localStorage.getItem("auth") || "{}");

    try {
      const skills = await getAllSkills();
      const values = await getAllValues();
      const candidateFetched = await getCandidateById(auth?.user?.id);
      const allValues = values.map((value: AllValues) => {
        return value.name;
      });
      const allSoftSkills = skills
        ? skills
            .filter((skill: AllSkill) => skill?.category === "soft_skill")
            .map((skill: AllSkill) => skill.name)
        : [];
      setAllValues(allValues);
      setAllSkills(skills);
      setAllSoftSkills(allSoftSkills);
      setCandidate(candidateFetched);
      const transformedData = transformCandidateDocs(candidateFetched);
      setSectionDocuments(transformedData);
      const transformedVisibleInfo =
        transformCandidateJobPref(candidateFetched);
      setSectionsJobSearchPref(transformedVisibleInfo);
      const transformedExperience = transformExperience(
        candidateFetched.experience
      );
      setSectionsExperience(transformedExperience);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchCandidate();
    setAllTypeOfJobs(allTypeOfJob as []);
  }, []);

  // handlers
  const editContactInfo = () => {
    setIsEditContactInfo(true);
  };

  const editLanguages = () => {
    setIsEditLanguages(true);
  };

  const editHandlerProfile = () => {
    setIsProfileEdit(true);
  };

  const editHandlerJobSearchPref = () => {
    setisJobSearchPrefEdit(true);
  };

  const editSkills = () => {
    setIsSkillsEdit(true);
  };

  const editValues = () => {
    setIsValuesEdit(true);
  };

  const editTypeOfJobs = () => {
    setIsTypeOfJobsEdit(true);
  };

  const editExperience = () => {
    setIsExperienceEdit(true);
  };

  const editDocuments = () => {
    setIsDocumentsEdit(true);
  };

  const getProgress = (progress: any) => {
    localStorage.setItem("progress", progress);
    if (progress === 100) {
      setIsCompleteProfile(true);
    } else {
      setIsCompleteProfile(false);
    }
  };

  /**
   * Handle the save of the profile info
   * @param valuesToAdd the values to add to the candidate object
   */
  const handleSaveEdit = async (valuesToAdd: object) => {
    // Add the values to the candidate object
    const candidateUpdated = { ...candidate, ...valuesToAdd };
    // Update the state
    setCandidate(candidateUpdated);
    // Send request to update the candidate
    const is_updated = await updateCandidateById(
      candidate?.user_id,
      candidateUpdated
    );
    await fetchCandidate();
  };

  const handleSaveToggleModal = (enabledStrings: string[]) => {
    setShowToggleModal(false);
    handleSaveEdit({ visible_information: enabledStrings });
  };

  if (isLoading) {
    return <Spinner />;
  }

  console.log("candidate", candidate);

  return (
    <div className={styling.main}>
      {/* Profile text */}
      <CardContainer className={`${styling.profileComponent}`}>
        {candidate?.first_name && candidate?.last_name ? (
          <Avatar
            size={80}
            firstName={candidate?.first_name}
            lastName={candidate?.last_name}
          />
        ) : (
          <Avatar size={80} firstName="John" lastName="Doe" />
        )}

        <div>
          <div className={styling.profile}>
            <div className={styling.profileTitle}>
              <h3>
                {candidate?.first_name} {candidate?.last_name}
              </h3>
              <h4 className={styling.preferredTitle}>
                {" "}
                | {candidate?.preferred_title}
              </h4>
            </div>
            {candidate?.job_status && (
              <div
                className={
                  candidate?.job_status === "Looking for a job"
                    ? `${styling.transparentGreen} ${styling.jobStatusTag}`
                    : `${styling.transparentRed} ${styling.jobStatusTag}`
                }
              >
                <h4>{candidate?.job_status}</h4>
              </div>
            )}
          </div>

          <div className={styling.location}>
            <IconMapPin color="black" />
            {candidate?.city && candidate?.country ? (
              <p>
                {candidate?.city}, {candidate?.country}
              </p>
            ) : (
              <p className={styling.stillToAdd} onClick={editHandlerProfile}>
                Add your location
              </p>
            )}
            <p className={styling.stillToAdd}>|</p>
            <div className={styling.row}>
              {candidate?.links && candidate?.links?.length > 0 ? (
                candidate?.links.map((link, index) => (
                  <div key={index} className={styling.link}>
                    {link.name === "LinkedIn" ? (
                      <a href={link.url} target="_blank" rel="noreferrer">
                        <IconBrandLinkedin color="black" />
                      </a>
                    ) : link.name === "Personal Website" ? (
                      <a href={link.url} target="_blank" rel="noreferrer">
                        <IconWorldWww color="black" />
                      </a>
                    ) : (
                      <></>
                    )}
                  </div>
                ))
              ) : (
                <>
                  <p
                    className={styling.stillToAdd}
                    onClick={editHandlerProfile}
                  >
                    Add links
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className={styling.editIcon}>
          <EditInput
            visible={isProfileEdit}
            setVisible={setIsProfileEdit}
            candidate={candidate}
            setValuesToEdit={setCandidate}
            fieldsToDisplay={fieldsToDisplayProfile}
            showModal={editHandlerProfile}
            onSave={handleSaveEdit}
            fieldKeysToEdit={[
              "first_name",
              "last_name",
              "preferred_title",
              "job_status",
              "city",
              "country",
              "links",
            ]}
          />
        </div>
      </CardContainer>

      <div className={styling.profileCompletedComponent}>
        {/* Profile completed */}
        <ProfileComplete
          setCountNullCategories={setCountNullCategories}
          className={styling.profileCompletedElement}
          candidate={candidate}
          editContactInfo={editContactInfo}
          editLanguages={editLanguages}
          editSkills={editSkills}
          editValues={editValues}
          editProfile={editHandlerProfile}
          editTypeOfJobs={editTypeOfJobs}
          editExperience={editExperience}
          editDocuments={editDocuments}
          editVisibleInformation={editHandlerJobSearchPref}
          editJobSearchPref={editHandlerJobSearchPref}
          getProgress={getProgress}
          hidden={isCompleteProfile}
        />

        {/* Unbiased job search */}
        <CardContainer
          className={
            isCompleteProfile
              ? styling.visibleContainer
              : styling.profileCompletedElement
          }
        >
          <div className={styling.profileCompletedEditIcon}>
            <h3 className={styling.h3}>Unbiased Job search</h3>
            <IconEdit color="black" onClick={() => setShowToggleModal(true)} />
            <ToggleModal
              visible={showToggleModal}
              allCategories={allCategories}
              selectedStrings={selectedStrings}
              title="Visible Information"
              subtitle="Choose what information you want to be visible to recruiters."
              buttonText="Save"
              onToggle={handleToggle}
              onAcceptWithEnabledStrings={handleSaveToggleModal}
              isTextAreaVisible={false}
              onCancel={() => {
                setSelectedStrings([true, true, true, true]);
                setShowToggleModal(false);
              }}
            />
          </div>
          <div className={styling.unbiasedSearch}>
            <IconSpy color="black" size={120} stroke={1.5} />
            <p>
              Your personal information is kept private by default until you
              choose to share it with recruiters who request access. Some
              information can be set as visible for your public profile.
            </p>
          </div>
        </CardContainer>
      </div>

      {/* Associations & Type of jobs  */}
      <div className={styling.inOneRow}>
        <CardContainer className={styling.associationContainer}>
          <div className={styling.profileCompletedEditIcon}>
            <h3 className={styling.h3}>Associations</h3>
          </div>
          <div className={styling.associationContainerLabels}>
            {candidate?.associations?.map((label, index) => (
              <Labels
                key={index}
                icon={<IconTags />}
                labelName={label}
                disableCloseIcon={true}
                customClass={styling.labelClass}
              />
            ))}
          </div>
        </CardContainer>
        <CardContainer
          className={
            countNullCategories["Type of jobs"] > 0
              ? styling.secondContainer
              : `${styling.secondContainer} ${styling.dottedLine}`
          }
        >
          <div className={styling.profileCompletedEditIcon}>
            <h3 className={styling.h3}>Type of jobs you're looking for</h3>
            <EditTypeOfJobs
              candidate={candidate}
              setCandidate={setCandidate}
              allLabels={allTypeOfJobs}
              icon={<IconTags />}
              titleName="Choose your type of jobs"
              onSave={handleSaveEdit}
              visible={isTypeOfJobsEdit}
              setVisible={setIsTypeOfJobsEdit}
              showModal={editTypeOfJobs}
            />
          </div>

          <div className={styling.associationContainerLabels}>
            {candidate?.preferred_jobs &&
              candidate?.preferred_jobs?.map((label, index) => (
                <Labels
                  key={index}
                  icon={<IconTags />}
                  labelName={label}
                  disableCloseIcon={true}
                  customClass={styling.labelClass}
                />
              ))}
          </div>
        </CardContainer>
      </div>

      {/* Skills */}
      <CardContainer
        className={
          countNullCategories["Skills"] > 0
            ? styling.skillsContainer
            : `${styling.skillsContainer} ${styling.dottedLine}`
        }
      >
        <div className={styling.profileCompletedEditIcon}>
          <div>
            <h3 className={styling.h3}>Hard skills & Soft skills</h3>
            <SkillsLevelGuide />
          </div>
          <EditSkills
            candidate={candidate}
            setCandidate={setCandidate}
            allHardSkills={allSkills}
            allSoftSkills={allSoftSkills}
            icon={<IconTags />}
            titleName="Choose your skills"
            onSave={handleSaveEdit}
            visible={isSkillsEdit}
            setVisible={setIsSkillsEdit}
            showModal={editSkills}
          />
        </div>
        <div className={styling.skillsContainerLabels}>
          {candidate?.skills &&
            candidate?.skills?.map((label, index) => (
              <Labels
                key={index}
                icon={<IconTags />}
                labelName={label.skill_name}
                disableCloseIcon={true}
                customClass={styling.labelClass}
                isSkill={true}
                skillLevel={label.skill_level}
              />
            ))}
          {/* soft skills */}
          {candidate?.soft_skills &&
            candidate?.soft_skills?.length > 0 &&
            candidate?.soft_skills?.map((label, index) => (
              <Labels
                key={index}
                icon={<IconTags />}
                labelName={label}
                disableCloseIcon={true}
                customClass={styling.labelClass}
              />
            ))}
        </div>
      </CardContainer>

      {/* Values & Experience */}
      <div className={styling.inOneRow}>
        {/* Values */}
        <CardContainer
          className={
            countNullCategories["Values"] > 0
              ? styling.valuesContainer
              : `${styling.valuesContainer} ${styling.dottedLine}`
          }
        >
          <div className={styling.profileCompletedEditIcon}>
            <h3 className={styling.h3}>Values</h3>
            <EditValues
              candidate={candidate}
              setCandidate={setCandidate}
              allLabels={allValues}
              icon={<IconTags />}
              titleName="Choose your values"
              onSave={handleSaveEdit}
              visible={isValuesEdit}
              setVisible={setIsValuesEdit}
              showModal={editValues}
            />
          </div>
          <div className={styling.valuesContainerLabels}>
            {candidate?.values &&
              candidate?.values?.map((label, index) => (
                <Labels
                  key={index}
                  icon={<IconTags />}
                  labelName={label}
                  disableCloseIcon={true}
                  customClass={styling.labelClass}
                />
              ))}
          </div>
        </CardContainer>

        {/* Experience */}
        <CardContainer
          className={
            countNullCategories["Experience"] > 0
              ? styling.experienceContainer
              : `${styling.experienceContainer} ${styling.dottedLine}`
          }
        >
          <div className={styling.profileCompletedEditIcon}>
            <h3 className={styling.h3}>Experience</h3>
            <EditExperience
              visible={isExperienceEdit}
              setVisible={setIsExperienceEdit}
              showModal={editExperience}
              candidate={candidate}
              setCandidate={setCandidate}
              onSave={handleSaveEdit}
            />
          </div>
          <ContentBlock sections={sectionsExperience} width="22rem" />
        </CardContainer>
      </div>

      {/* Contact info, languages, Documents */}
      {/* Contact info */}
      <div className={styling.inOneRow}>
        <CardContainer
          className={
            countNullCategories["Contact info"] > 0
              ? styling.lowerContainer
              : `${styling.lowerContainer} ${styling.dottedLine}`
          }
        >
          <div className={styling.profileCompletedEditIcon}>
            <h3 className={styling.h3}>Contact info</h3>
            <EditInput
              visible={isEditContactInfo}
              setVisible={setIsEditContactInfo}
              candidate={candidate}
              setValuesToEdit={setCandidate}
              fieldsToDisplay={fieldsToDisplayContactInfo}
              showModal={editContactInfo}
              onSave={handleSaveEdit}
              fieldKeysToEdit={["phone_number", "email", "address"]}
            />
          </div>
          <div className={styling.padding}>
            <p className={styling.contactParagraph}>
              <strong>Phone number:</strong> {candidate?.phone_number}
            </p>
            <p className={styling.contactParagraph}>
              <strong>Email:</strong> {candidate?.email}
            </p>
            <p className={styling.contactParagraph}>
              <strong>Address:</strong> {candidate?.address}
            </p>
          </div>
        </CardContainer>

        {/* Laguages */}
        <CardContainer
          className={
            countNullCategories["Languages"] > 0
              ? styling.lowerContainer
              : `${styling.lowerContainer} ${styling.dottedLine}`
          }
        >
          <div className={styling.profileCompletedEditIcon}>
            <h3 className={styling.h3}>Languages</h3>
            <IconEdit
              color="black"
              style={{ cursor: "pointer" }}
              onClick={editLanguages}
            />
          </div>
          <EditLanguages
            visible={isEditLanguages}
            setVisible={setIsEditLanguages}
            values={candidate}
            setValues={setCandidate}
            onSave={handleSaveEdit}
          />
          <ProgressBarComponent candidate={candidate} />
        </CardContainer>

        {/* Uploaded documents */}
        <CardContainer
          className={
            countNullCategories["Documents"] > 0
              ? styling.lowerContainer
              : `${styling.lowerContainer} ${styling.dottedLine}`
          }
        >
          <div className={styling.profileCompletedEditIcon}>
            <h3 className={styling.h3}>Uploaded documents</h3>
            <DocumentUploadModal
              candidate={candidate}
              setCandidate={setCandidate}
              visible={isDocumentsEdit}
              setVisible={setIsDocumentsEdit}
              showModal={editDocuments}
              onSave={handleSaveEdit}
            />
          </div>
          <ContentBlock sections={sectionDocuments} />
        </CardContainer>
      </div>

      {/* Job search preferences */}
      <CardContainer
        className={
          countNullCategories["Job Preferences"] > 0
            ? styling.jobPrefContainer
            : `${styling.jobPrefContainer} ${styling.dottedLine}`
        }
      >
        <div className={styling.profileCompletedEditIcon}>
          <h3 className={styling.h3}>Job Search Preferences</h3>
          <EditJobSearchPref
            candidate={candidate}
            visible={isJobSearchPrefEdit}
            setVisible={setisJobSearchPrefEdit}
            showModal={editHandlerJobSearchPref}
            onSave={handleSaveEdit}
          />
        </div>
        <div className={styling.visibleSection}>
          <ContentBlock sections={sectionsJobSearchPref} width="16rem" />
        </div>
      </CardContainer>
    </div>
  );
};

export default CandidateProfile;
