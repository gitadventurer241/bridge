import { useEffect, useState } from "react";
import { JobCard } from "../../shared/jobCard/JobCard";
import { getAllJobs } from "../../../api/jobs";
import styling from "./Jobs.module.css";
import { getAllCompanies } from "../../../api/companies";
import { useNavigate } from "react-router-dom";
import { Candidate, Company, Job } from "../../../types/types";
import { getCandidateById } from "../../../api/candidates";
import SearchJobs from "../../UI/searchbar/SearchJobs";
import FilterSelect from "../../UI/filter/FilterSelect";
import DisplayMultiFilter from "../../UI/filter/DisplayMultiFilter";
import { Select } from "antd";
import SortBy from "../../UI/filter/SortBy";
import { IconMapPin } from "@tabler/icons-react";
import Spinner from "../../UI/spinner/Spinner";

const Jobs = () => {
  const navigate = useNavigate();
  const auth = JSON.parse(localStorage.getItem("auth") || "{}");
  const userId = auth?.user?.id;
  const userType = auth?.user?.user_type;

  const [jobs, setJobs] = useState([] as Job[]);
  const [companyJobs, setCompanyJobs] = useState([] as Job[]);
  const [companies, setCompanies] = useState([] as Company[]);
  const [candidate, setCandidate] = useState({} as Candidate);
  const [matchedScoreVisible, setMatchedScoreVisible] = useState(true);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchInfo = async () => {
    const allJobs = await getAllJobs();
    const allCompanies = await getAllCompanies();
    if (auth?.user?.user_type === "candidate") {
      const candidate = await getCandidateById(userId);
      setCandidate(candidate);
    }

    if (auth?.user?.user_type === "company") {
      setMatchedScoreVisible(false);
      const jobs = allJobs?.filter((job: Record<string, any>) => {
        if (job["company_id"] === userId) {
          return job;
        }
      });
      setJobs(jobs);
    } else {
      setJobs(allJobs);
    }
    setCompanies(allCompanies);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  const header = () => {
    if (userType === "company") {
      return (
        <div className={styling.header}>
          <h1>My jobs</h1>
          <p>Here you can see all your published jobs</p>
        </div>
      );
    } else {
      return (
        <div className={styling.header}>
          <h1>Jobs</h1>
          <p>Here you can see all published jobs</p>
        </div>
      );
    }
  };

  const locationOptions = Array.from(
    new Set(jobs?.map((job) => job?.location_city))
  );

  const handleLocationChange = (selected: string[]) => {
    setSelectedLocations(selected);
  };
  const handleSearch = (results: (Job | Company)[]) => {
    const jobResults = results.filter((item) => "company_id" in item) as Job[];
    setFilteredJobs(jobResults);
  };
  const handleSelectChange = (selectedValues: string[]) => {
    setSelectedValues(selectedValues);
  };

  const filterData = (
    selectedOptions: string[],
    data: (Company | Job)[]
  ): (Company | Job)[] => {
    return data.filter((item) => {
      if ("work_location" in item && "employment_type" in item) {
        const matches = selectedOptions.some((option) => {
          const lowercaseOption = option.toLowerCase();
          const lowercaseWorkLocation =
            item["work_location"]?.toLowerCase() || "";
          const lowercaseEmploymentType =
            item["employment_type"]?.toLowerCase() || "";
          return (
            lowercaseWorkLocation === lowercaseOption ||
            lowercaseEmploymentType === lowercaseOption
          );
        });
        return matches;
      }
      return false;
    });
  };

  useEffect(() => {
    const applyFilters = () => {
      const filteredJobs = jobs.filter(
        (job) =>
          (selectedLocations.length === 0 ||
            selectedLocations.includes(job.location_city || "")) &&
          (selectedValues.length === 0 ||
            selectedValues.some(
              (value) =>
                job.work_location?.toLowerCase() === value.toLowerCase() ||
                job.employment_type?.toLowerCase() === value.toLowerCase()
            ))
      );
      setFilteredJobs(filteredJobs);
    };

    if (selectedValues.length === 0 && selectedLocations.length === 0) {
      setFilteredJobs(jobs);
    } else {
      applyFilters();
    }
  }, [selectedLocations, selectedValues, jobs]);
  const handleSortChange = (order: string) => {
    setSortOrder(order);
    const sortedJobs = [...jobs].sort(sortJobsByDate);
    setJobs(sortedJobs);
  };

  const sortJobsByDate = (a: Job, b: Job) => {
    const dateA = new Date(a.date_created ?? "");
    const dateB = new Date(b.date_created ?? "");
    if (dateA < dateB) {
      return sortOrder === "asc" ? -1 : 1;
    } else if (dateA > dateB) {
      return sortOrder === "asc" ? 1 : -1;
    } else {
      return 0;
    }
  };

  const content = (
    <div className={styling.main}>
      {header()}
      <div className={styling.inputContainer}>
        <div className={styling.inputs}>
          <div className={styling.searchText}>
            <SearchJobs data={jobs} onSearch={handleSearch} />
          </div>
          <div className={styling.filters}>
            <Select
              placeholder="Anywhere"
              style={{ width: 200 }}
              mode="multiple"
              value={selectedLocations}
              onChange={handleLocationChange}
              maxTagCount={1}
              suffixIcon={<IconMapPin />}
            >
              {locationOptions?.map((location, index) => {
                return (
                  <Select.Option key={index} value={location}>
                    {location}
                  </Select.Option>
                );
              })}
            </Select>

            <FilterSelect
              filterData={filterData}
              data={jobs}
              onSearch={handleSearch}
              onSelectChange={handleSelectChange}
              selectedValues={selectedValues}
            />
          </div>
        </div>
        <div className={styling.multiFilter}>
          <DisplayMultiFilter
            filterData={filterData}
            data={jobs}
            selectedValues={selectedValues}
            onSelectChange={handleSelectChange}
            onSearch={handleSearch}
          />
        </div>
      </div>
      <div className={styling.sortByDate}>
        <div>
          We have found{" "}
          <span className={styling.count}>{filteredJobs.length}</span> jobs!
        </div>
        <div className={styling.sortBy}>
          <SortBy onChange={handleSortChange} />
        </div>
      </div>
      <div className={styling.cardContainer}>
        {filteredJobs &&
          filteredJobs?.map((job) => (
            <JobCard
              key={job?.id}
              job={job}
              companies={companies}
              candidate={candidate}
              onClick={() => navigate(`/job/${job?.id}`)}
              isMatchVisible={matchedScoreVisible}
            />
          ))}
      </div>
    </div>
  );

  return isLoading ? <Spinner /> : content;
};

export default Jobs;
