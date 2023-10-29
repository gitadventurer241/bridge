import styling from "./PublicJob.module.css";
import Avatar from "../../UI/avatar/Avatar";
import { Button } from "../../UI/button/Button";
import {
  IconBookmark,
  IconMapPin,
  IconBriefcase2,
  IconCoins,
  IconChartPie,
} from "@tabler/icons-react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getJobById } from "../../../api/jobs";
import { getCompanyById } from "../../../api/companies";
import { Job, Company, Candidate } from "../../../types/types";
import { TimeAgo } from "../helpers/helper";

import { getCandidateById, updateCandidateById } from "../../../api/candidates";

import { Tabs } from "antd";
import DetailsTab from "./tabs/details/DetailsTab";
import JobMatchesTab from "./tabs/matches/MatchesTab";
import Spinner from "../../UI/spinner/Spinner";
import ApplyModal from "./applyModal/ApplyModal";

const PublicJob = () => {
  // Job id from url
  const { id } = useParams<{ id: string }>();
  const userId = JSON.parse(localStorage.getItem("auth") || "{}")?.user?.id;
  const userType = JSON.parse(localStorage.getItem("auth") || "{}")?.user
    ?.user_type;
  const iconSize = 20;

  // state
  const [candidate, setCandidate] = useState<Candidate>();
  const [jobData, setJobData] = useState<Job>({} as Job);
  const [companyData, setCompanyData] = useState<Company>();
  const [isSaved, setIsSaved] = useState(false);
  const [matchScore, setMatchScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplyModalOpen, setApplyModalOpen] = useState(false);

  /**
   * Get job and company data
   * @param id - job id
   */
  const getInfo = async (id: string) => {
    const getJob = await getJobById(id);

    if (userType === "candidate") {
      try {
        const candidate = await getCandidateById(userId);
        const fetchIsSaved = candidate?.saved_items?.includes(getJob?.id);
        setIsSaved(fetchIsSaved);
        setCandidate(candidate);

        const matchScore = candidate?.matching_jobs.find(
          (job: Job) => job.id === getJob?.id
        )?.score;
        if (matchScore) {
          setMatchScore(matchScore);
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }

    if (getJob) {
      try {
        const getCompany = await getCompanyById(getJob?.company_id ?? "");
        setCompanyData(getCompany);
        setJobData(getJob);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getInfo(id ?? "");
  }, [id]);

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

  const saveJob = async () => {
    // add to local storage
    setIsSaved(!isSaved);
    // if not yet saved
    if (!isSaved) {
      // Check if the job is already saved
      const isJobSaved = candidate?.saved_items?.includes(jobData?.id);
      if (isJobSaved) {
        return;
      } else {
        localStorage.setItem(
          "saved_items",
          JSON.stringify([...(candidate?.saved_items || []), jobData?.id])
        );
        await updateCandidateById(candidate?.user_id || "", {
          saved_items: [...(candidate?.saved_items || []), jobData?.id],
        });
      }
    } else {
      // if already saved
      const savedItems = JSON.parse(
        localStorage.getItem("saved_items") || "[]"
      );
      // Check if the job is already saved in local storage
      const isJobSaved = savedItems.includes(jobData?.id);
      if (!isJobSaved) {
        return;
      }
      const filtered = savedItems.filter(
        (savedItem: string) => savedItem !== jobData?.id
      );
      localStorage.setItem("saved_items", JSON.stringify(filtered));
      await updateCandidateById(candidate?.user_id || "", {
        saved_items: filtered,
      });
    }
  };

  const isBookmark = () => {
    if (userType === "candidate") {
      if (isSaved) {
        return (
          <IconBookmark className={styling.savedBookmark} onClick={saveJob} />
        );
      } else {
        return <IconBookmark className={styling.bookmark} onClick={saveJob} />;
      }
    } else {
      return null;
    }
  };

  const tabs = [
    {
      label: "Details",
      key: "1",
      children: (
        <DetailsTab
          candidate={candidate}
          companyData={companyData}
          jobData={jobData}
          getInfo={getInfo}
          id={id}
          userType={userType}
        />
      ),
    },
    {
      label: "Matches",
      key: "2",
      children: <JobMatchesTab job={jobData} />,
      disabled: userType === "candidate",
    },
  ];

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styling.main}>
      {/* First line */}
      <div className={styling.rowEnd}>
        <div className={styling.row}>
          <Avatar firstName={companyData?.company_name} size={50} />
          {companyData?.company_name ? (
            <h3>{companyData?.company_name}</h3>
          ) : (
            <h3>Company</h3>
          )}
          <p>|</p>
          <p>
            Posted{" "}
            {jobData?.date_created && (
              <TimeAgo timestamp={jobData?.date_created} />
            )}
          </p>
        </div>
        <div className={styling.row}>
          {isBookmark()}
          {userType === "candidate" && (
            <Button
              className={styling.companyButton}
              onClick={toggleApplyModal}
              disabled={isApplied()}
            >
              Apply
            </Button>
          )}
        </div>
      </div>
      <ApplyModal
        isApplyModalOpen={isApplyModalOpen}
        company={companyData}
        jobId={jobData?.id}
        candidate={candidate}
        callback={toggleApplyModal}
      />

      {/* Second line */}
      <div>
        <div>
          <h1 className={styling.jobTitle}>{jobData?.title}</h1>
        </div>
        <div className={styling.row}>
          <div className={styling.row}>
            <IconMapPin size={iconSize} />{" "}
            <p>
              {jobData?.location_city}, {jobData?.location_country} (
              {jobData?.work_location})
            </p>
          </div>
          <div className={styling.row}>
            <IconBriefcase2 size={iconSize} /> <p>{jobData?.employment_type}</p>
          </div>
          <div className={styling.row}>
            <IconCoins size={iconSize} />{" "}
            <p>
              {jobData?.salary && jobData?.salary?.length > 0 ? (
                <>
                  {jobData?.salary![0]} - {jobData?.salary![1]}
                </>
              ) : (
                "Not provided"
              )}
            </p>
          </div>
        </div>
        {matchScore && (
          <div className={`${styling.row} ${styling.matchingScoreDiv}`}>
            <IconChartPie size={35} fill="#2839A8" />
            <p className={styling.matchScore}>{matchScore}% Match</p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={styling.margin}>
        <Tabs items={tabs} centered={false} size="large" />
      </div>
    </div>
  );
};

export default PublicJob;
