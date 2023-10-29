import { useEffect, useState } from "react";
import { CandidateCard } from "../../shared/CandidateCard/CandidateCard";
import styling from "./Candidates.module.css";
import Filter from "../../UI/filter/Filter";
import { getAllCandidates } from "../../../api/candidates";
import { useNavigate } from "react-router-dom";
import Searchbar from "../../UI/searchbar/Searchbar";
import { Candidate, Skill, User } from "../../../types/types";
import { getCompanyById } from "../../../api/companies";
import { getAssociationById } from "../../../api/associations";
import Spinner from "../../UI/spinner/Spinner";
import MultiFilter from "./filters/Multifilter";
import SortBy from "../../UI/filter/SortBy";

const Candidates = () => {
  const navigate = useNavigate();

  const userId =
    JSON.parse(localStorage.getItem("auth") || "{}")?.user?.id || "";
  const userType = JSON.parse(localStorage.getItem("auth") || "{}")?.user
    ?.user_type;

  //State
  const [user, setUser] = useState({} as User);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([]);
  const [candidatesSource, setCandidatesSource] = useState<Candidate[]>([]);
  const [skillsOptions, setSkillsOptions] = useState<string[]>([]);
  const [associationsOptions, setAssociationsOptions] = useState<string[]>([]);
  const [valuesOptions, setValuesOptions] = useState<string[]>([]);
  const [softSkillsOptions, setSoftSkillsOptions] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  /**
   * Handle multifilter change
   * @param filteredCandidates - filtered candidates
   */
  const handleMultifilterChange = (
    filteredCandidates: Candidate[],
    selectedValues: string[]
  ) => {
    setSelectedValues(selectedValues);
    setFilteredCandidates(filteredCandidates);
  };

  /**
   *  Handle filter change
   * @param filteredCandidates - filtered candidates
   */
  const handleFilterChange = (filteredCandidates: Candidate[]) => {
    setFilteredCandidates(filteredCandidates);
  };

  /**
   * Handle sort change
   * @param order - order to sort the candidates
   */
  const handleSortChange = (order: string) => {
    setSortOrder(order);
    const sortedCandidates = [...filteredCandidates].sort(sortCandidatesByDate);
    setFilteredCandidates(sortedCandidates);
  };

  /**
   * Sort the candidates by date
   * @param a  - candidate a
   * @param b  - candidate b
   * @returns
   */
  const sortCandidatesByDate = (a: Candidate, b: Candidate) => {
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

  /**
   * Handle the search in the candidates
   * @param searchText - search text
   */
  const filterBySearch = (query: string) => {
    if (query.trim() === "") {
      setCandidates(candidatesSource);
      setFilteredCandidates(candidatesSource);
      return;
    }

    /**
     * Filter the candidates by the query
     */
    const filterCandidates = candidates.filter((candidate: Candidate) => {
      const { preferred_title, skills, soft_skills, values, associations } =
        candidate;
      const lowerCaseQuery = query.toLowerCase();

      return (
        preferred_title?.toLowerCase().includes(lowerCaseQuery) ||
        skills
          ?.map((skill) => skill.skill_name.toLowerCase())
          .includes(lowerCaseQuery) ||
        soft_skills
          ?.map((value) => value.toLowerCase())
          .includes(lowerCaseQuery) ||
        values?.map((value) => value.toLowerCase()).includes(lowerCaseQuery) ||
        associations
          ?.map((association) => association.toLowerCase())
          .includes(lowerCaseQuery)
      );
    });
    setCandidates(filterCandidates);
    setFilteredCandidates(filterCandidates);
  };

  const handleSearch = (query: string) => {
    filterBySearch(query);
  };

  /**
   * Fetches the candidates data object by id
   */
  const fetchInfo = async () => {
    try {
      const candidates = await getAllCandidates();

      const associations = Array.from(
        new Set(
          candidates
            .flatMap((candidate: Candidate) => candidate.associations || [])
            .filter(Boolean)
        )
      ) as string[];

      const values = Array.from(
        new Set(
          candidates
            .flatMap((candidate: Candidate) => candidate.values || [])
            .filter(Boolean)
        )
      ) as string[];

      const softSkills = Array.from(
        new Set(
          candidates
            .flatMap((candidate: Candidate) => candidate.soft_skills || [])
            .filter(Boolean)
        )
      ) as string[];

      const hardSkills = Array.from(
        new Set(
          candidates
            .map((candidate: Candidate) => candidate.skills || [])
            .flatMap((skills: Skill[]) =>
              skills.map((skill: Skill) => skill.skill_name || [])
            )
            .filter(Boolean)
        )
      ) as object as string[];

      // here I fetch or company or association
      if (userType === "association") {
        // exclude the association that is logged in
        const association = await getAssociationById(userId);
        setUser(association);
      } else if (userType === "company") {
        const company = await getCompanyById(userId);
        setUser(company);
      }

      // Set the states
      setCandidates(candidates);
      setFilteredCandidates(candidates);
      setCandidatesSource(candidates);
      setAssociationsOptions(associations);
      setValuesOptions(values);
      setSoftSkillsOptions(softSkills);
      setSkillsOptions(hardSkills);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
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
      <div>
        <h1 className={styling.header}>The best talent is right here!</h1>
        <p>Here you can find highly skilled candidates</p>
      </div>
      <div className={styling.filters}>
        <Searchbar
          placeholder="Search..."
          width={800}
          onSearch={handleSearch}
        />
        <div className={styling.filterDropdown}>
          <Filter
            options={associationsOptions}
            data={candidates}
            placeholder="Associations"
            criteria="associations"
            onFilterChange={handleFilterChange}
          />

          <MultiFilter
            data={candidates}
            skillsOptions={skillsOptions}
            softSkillsOptions={softSkillsOptions}
            selectedValues={selectedValues}
            valuesOptions={valuesOptions}
            onFilterChange={handleMultifilterChange}
          />
        </div>
      </div>

      <div className={styling.sortByDate}>
        <div>
          We have found{" "}
          <span className={styling.count}>{filteredCandidates.length}</span>{" "}
          candidates!
        </div>
        <div className={styling.sortBy}>
          <SortBy onChange={handleSortChange} />
        </div>
      </div>

      <div className={styling.cards}>
        {filteredCandidates?.map((candidate, index) => (
          <CandidateCard
            key={index}
            candidate={candidate}
            user={user}
            user_type={userType}
            header={candidate?.preferred_title}
            subheader={candidate?.job_status}
            associations={candidate?.associations}
            skills={candidate?.skills}
            soft_skills={candidate?.soft_skills}
            values={candidate?.values}
            onClickRedirect={() => {
              navigate(`/candidate/${candidate.user_id}`);
            }}
            isBookmarkVisible={userType === "company"}
          />
        ))}
      </div>
    </div>
  );
};

export default Candidates;
