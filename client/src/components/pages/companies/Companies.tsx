import { useEffect, useState } from "react";
import CompanyCard from "../../shared/companyCard/CompanyCard";
import styling from "./Companies.module.css";
import Filter from "../../UI/filter/Filter";
import { useNavigate } from "react-router-dom";
import { getAllCompanies } from "../../../api/companies";
import Searchbar from "../../UI/searchbar/Searchbar";
import Spinner from "../../UI/spinner/Spinner";

interface Company {
  user_id: string;
  company_name: string;
  address: string;
  description: string;
  associations: string[];
  values: string[];
}

const Companies = () => {
  const navigate = useNavigate();

  // State
  const [filteredCompanies, setFilteredCompanies] = useState<Company[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [companiesSource, setCompaniesSource] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [associations, setAssociations] = useState<string[]>([]);
  const [values, setValues] = useState<string[]>([]);

  /**
   * Handle filter change
   * @param filteredCompanies - filtered companies
   */
  const handleFilterChange = (filteredCompanies: Company[]) => {
    setFilteredCompanies(filteredCompanies);
  };

  /**
   * Handle the search in the companies
   * @param searchText - search text
   */
  const filterBySearch = (query: string) => {
    if (query.trim() === "") {
      setCompanies(companiesSource);
      setFilteredCompanies(companiesSource);
      return;
    }

    const filteredCompanies = companies.filter((company: Company) => {
      const { company_name, values, associations } = company;
      const lowerCaseQuery = query.toLowerCase();

      return (
        company_name?.toLowerCase().includes(lowerCaseQuery) ||
        values?.map((value) => value.toLowerCase()).includes(lowerCaseQuery) ||
        associations
          ?.map((association) => association.toLowerCase())
          .includes(lowerCaseQuery)
      );
    });
    setCompanies(filteredCompanies);
    setFilteredCompanies(filteredCompanies);
  };

  const handleSearch = (query: string) => {
    filterBySearch(query);
  };

  /**
   * Fetch all companies from the database
   */
  const fetchInfo = async () => {
    try {
      const companies = await getAllCompanies();
      const associations = Array.from(
        new Set(
          companies
            .flatMap((company: Company) => company.associations || [])
            .filter(Boolean)
        )
      ) as string[];

      const values = Array.from(
        new Set(
          companies
            .flatMap((company: Company) => company.values || [])
            .filter(Boolean)
        )
      ) as string[];

      setValues(values);
      setAssociations(associations);
      setCompanies(companies);
      setCompaniesSource(companies);
      setFilteredCompanies(companies);
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
      <h1 className={styling.header}>Our partner companies</h1>
      <p>Here you can find every partner company</p>
      <div className={styling.filters}>
        <Searchbar
          placeholder="Search..."
          width={800}
          onSearch={handleSearch}
        />
        <div className={styling.filterDropdown}>
          <Filter
            options={values}
            data={companies}
            placeholder="Values"
            criteria="values"
            onFilterChange={handleFilterChange}
          />
          <Filter
            options={associations}
            data={companies}
            placeholder="Associations"
            criteria="associations"
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      <div className={styling.cards}>
        {filteredCompanies?.map((company, index) => (
          <CompanyCard
            key={index}
            header={company?.company_name}
            companyName={company?.company_name}
            subheader={company?.address ? company?.address : "No address"}
            associations={company?.associations}
            values={company?.values}
            onClickRedirect={() => {
              navigate(`/company/${company?.user_id}`);
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Companies;
