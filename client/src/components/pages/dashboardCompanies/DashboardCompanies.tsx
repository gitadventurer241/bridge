import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Avatar from "../../UI/avatar/Avatar";
import Spinner from "../../UI/spinner/Spinner";
import { HorizontalCard } from "../../UI/horizontalCard/HorizontalCard";
import { CardContainer } from "../../UI/container/CardContainer";

import { Candidate, Company } from "../../../types/types";
import { getAllJobs } from "../../../api/jobs";
import { getCompanyById } from "../../../api/companies";
import { getAllCandidates } from "../../../api/candidates";
import getMatchingCandidatesInfo from "./helpers/index";

import {
  IconBrandLinkedin,
  IconExternalLink,
  IconMapPin,
  IconWorldWww,
} from "@tabler/icons-react";

import styling from "./DashboardCompanies.module.css";
import { getMatchCandidates } from "../../../api/match";

const DashboardCompany = () => {

  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem("auth") || "{}")?.user?.id;
  const [company, setCompany] = useState({} as Company);
  const [matchingCandidates, setMatchingCandidates] = useState([]);
  const [allJobs, setAllJobs] = useState<Record<string, any>[]>();
  const [allCandidates, setAllCandidates] = useState<Candidate[]>();
  const [isLoading, setIsLoading] = useState(true);

  const fetchInfo = async () => {
    try {
      const allCandidates = await getAllCandidates();
      setAllCandidates(allCandidates);
      const allJobs = await getAllJobs();
      setAllJobs(allJobs);
      const jobs = allJobs?.filter((job: Record<string, any>) => {
        return job["company_id"] === userId;
      });

      await Promise.all(
        jobs?.map(async (job: Record<string, any>) => {
          if (job && job?.id) {
            return getMatchCandidates(job?.id);
          }
        })
      );
      const matchingCandidates = getMatchingCandidatesInfo(jobs, allCandidates);
      setMatchingCandidates(matchingCandidates);
      setIsLoading(false);
    } catch (error) {
      console.log("Matching error: ", error);
      setIsLoading(false);
    }

    try {
      const company = await getCompanyById(userId);
      setCompany(company);
      setIsLoading(false);
    } catch (error) {
      console.log("Company error: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const avatar = company.logo ? (
    <img className={styling.logo} src={company.logo} alt="Avatar" />
  ) : (
    <Avatar firstName={company.company_name} size={80} />
  );

  if (isLoading) {
    return <Spinner />;
  }

  const content = (
    <>
      {/* Profile component */}
      <CardContainer className={styling.profile}>
        {avatar}

        <div className={styling.header}>
          <h2 className={styling.title}>
            Welcome back, {company.company_name}
          </h2>
          <div className={styling.subtitle}>
            {company?.address ? (
              <>
                <IconMapPin />
                <p className={styling.subtext}>{company?.address}</p>
              </>
            ) : (
              <>
                <IconMapPin />
                <p className={styling.subtextNot}>Address not provided</p>
              </>
            )}
            {company.company_size ? (
              <>
                <p className={styling.subtext}> | </p>
                <p className={styling.subtext}>
                  {company.company_size} employees
                </p>
              </>
            ) : null}
            {company.company_website ? (
              <>
                <p className={styling.subtext}> | </p>
                <IconBrandLinkedin
                  onClick={() => navigate(`${company?.company_website}`)}
                />{" "}
                <IconWorldWww />
              </>
            ) : null}
          </div>
        </div>

        <IconExternalLink
          className={styling.icon}
          color="black"
          onClick={() => navigate(`/company-profile/${userId}`)}
        />
      </CardContainer>

      {/* Find Jobs */}
      <div className={styling.section}>
        <CardContainer className={styling.card}>
          <h1>Interested candidates</h1>

          {Array.isArray(company?.interested_candidates) &&
          company?.interested_candidates.length > 0 ? (
            company?.interested_candidates.map(
              (candidate: any, key: number) => {
                const candidateInfo = allCandidates?.find(
                  (c) => c?.user_id === candidate?.candidate_id
                );
                const jobInfo = allJobs?.find(
                  (j) => j?.id === candidate?.job_id
                );

                return (
                  <div
                    key={key}
                    onClick={() =>
                      navigate(`/candidate/${candidate?.candidate_id}`)
                    }
                  >
                    <HorizontalCard
                      avatar={true}
                      firstName={candidateInfo?.first_name}
                      lastName={candidateInfo?.last_name}
                      title={`A new candidate is interested in your ${jobInfo?.title} vacancy!`}
                      subtitle={`Get in touch with them!`}
                    />
                  </div>
                );
              }
            )
          ) : (
            <p className={styling.emptyText}>
              {" "}
              Ups... looks like there is nothing to show... YET!
            </p>
          )}
        </CardContainer>

        <CardContainer className={styling.card}>
          <h1>Newest matches</h1>
          {matchingCandidates && matchingCandidates.length > 0 ? (
            matchingCandidates.map((candidate: Record<string, any>, index) => (
              <div
                key={index}
                onClick={() => navigate(`/candidate/${candidate?.candidateId}`)}
              >
                <HorizontalCard
                  avatar={true}
                  firstName={candidate?.candidateFirstName}
                  lastName={candidate?.candidateLastName}
                  title={`Matches ${candidate?.candidateScore}% of the skills`}
                  subtitle={`Great match for ${candidate?.jobTitle} job!`}
                />
              </div>
            ))
          ) : (
            <p className={styling.emptyText}>
              Ups... looks like there is nothing to show... YET!
            </p>
          )}
        </CardContainer>
      </div>
    </>
  );

  return <div className={styling.main}>{content}</div>;
};

export default DashboardCompany;
