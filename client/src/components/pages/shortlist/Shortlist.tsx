import { useEffect, useState } from "react";
import { JobCard } from "../../shared/jobCard/JobCard";
import styling from "./Shortlist.module.css";
import { getAllCandidates, getCandidateById } from "../../../api/candidates";
import { Candidate, Company, Job, User } from "../../../types/types";
import { getJobById } from "../../../api/jobs";
import { useNavigate } from "react-router-dom";
import { getAllCompanies, getCompanyById } from "../../../api/companies";
import { CandidateCard } from "../../shared/CandidateCard/CandidateCard";
import Spinner from "../../UI/spinner/Spinner";

const Shortlist = () => {
  const navigate = useNavigate();
  const [candidate, setCandidate] = useState({} as Candidate);
  const [user, setUser] = useState({} as User);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([] as Job[]);
  const [candidates, setCandidates] = useState([] as Candidate[]);
  const [companies, setCompanies] = useState([] as Company[]);
  const userId = JSON.parse(localStorage.getItem("auth") || "{}")?.user?.id;
  const user_type = JSON.parse(localStorage.getItem("auth") || "{}")?.user
    ?.user_type;

  const fetchInfo = async () => {
    if (user_type === "candidate") {
      try {
        const candidate = await getCandidateById(userId);
        const allCompanies = await getAllCompanies();

        // fetch all jobs from candidate's shortlist
        const jobsIds = candidate?.saved_items;

        if (jobsIds && jobsIds?.length > 0) {
          // Use Promise.all to fetch jobs concurrently
          const jobPromises = jobsIds?.map(async (jobId: string) => {
            return getJobById(jobId);
          });
          // Wait for all job fetch promises to resolve
          const jobs = await Promise.all(jobPromises);
          // jobs is now an array of type Job[]
          setJobs(jobs);
        }
        setCandidate(candidate);
        setCompanies(allCompanies);
        setIsLoading(false);
      } catch (error) {
        console.log("ERROR:", error);
        setIsLoading(false);
      }
    }
    if (user_type === "company") {
      try {
        const company = await getCompanyById(userId);
        const allCandidates = await getAllCandidates();
        // fetch all jobs from company's shortlist
        const candidatesIds = company?.saved_items;
        console.log(candidatesIds);

        if (candidatesIds && candidatesIds?.length > 0) {
          // Use Promise.all to fetch candidates concurrently
          try {
            const candidatePromises = candidatesIds?.map(
              async (candidateId: string) => {
                return getCandidateById(candidateId);
              }
            );
            // Wait for all candidate fetch promises to resolve
            const candidates = await Promise.all(candidatePromises);
            // candidates is now an array of type Candidate[]
            setCandidates(candidates);
          } catch (error) {
            console.log("ERROR:", error);
          }
        }
        setUser(company);
        setCandidate(allCandidates);
        setIsLoading(false);
      } catch (error) {
        console.log("ERROR:", error);
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styling.main}>
      <h1>Shortlist</h1>
      {user_type === "candidate" && (
        <div className={styling.cardContainer}>
          {jobs &&
            jobs?.map((job, index) => (
              <JobCard
                key={index}
                job={job}
                companies={companies}
                candidate={candidate}
                onClick={() => navigate(`/job/${job?.id}`)}
                isMatchVisible={true}
              />
            ))}
        </div>
      )}
      {user_type === "company" && (
        <div className={styling.cardContainer}>
          {candidates &&
            candidates?.length > 0 &&
            candidates?.map((candidate, index) => (
              <CandidateCard
                key={index}
                candidate={candidate}
                user={user}
                header={candidate?.preferred_title}
                subheader={candidate?.job_status}
                associations={candidate?.associations}
                skills={candidate?.skills}
                onClickRedirect={() => {
                  navigate(`/candidate/${candidate?.user_id}`);
                }}
                isBookmarkVisible={true}
              />
            ))}
        </div>
      )}
    </div>
  );
};

export default Shortlist;
