import { useEffect, useState } from "react";
import Filter from "../../UI/filter/Filter";
import Searchbar from "../../UI/searchbar/Searchbar";
import styling from "./Associations.module.css";
import { getAllAssociations } from "../../../api/associations";
import { Association, Iniciatives } from "../../../types/types";
import AssociationCard from "../../shared/associationCard/AssociationCard";
import { useNavigate } from "react-router-dom";
import Spinner from "../../UI/spinner/Spinner";

const Associations = () => {
  const userId =
    JSON.parse(localStorage.getItem("auth") || "{}")?.user?.id || "";
  const userType =
    JSON.parse(localStorage.getItem("auth") || "{}")?.user?.user_type || "";

  // State
  const [associations, setAssociation] = useState<Association[]>([]);
  const [associationsSource, setAssociationSource] = useState<Association[]>(
    []
  );
  const [filterAssociations, setFilterAssociation] = useState<Association[]>(
    []
  );
  const [associationIniciatives, setAssociationIniciatives] = useState<any[]>(
    []
  );

  const [associationNames, setAssociationName] = useState<any[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);

  const navigate = useNavigate();

  const fetchInfo = async () => {
    const associations = await getAllAssociations();
    if (userType === "association") {
      // exclude the association that is logged in
      const filteredAssociations = associations.filter(
        (association: Association) => association?.user_id !== userId
      );
      setAssociation(filteredAssociations);
      setAssociationSource(filteredAssociations);
      setFilterAssociation(filteredAssociations);

      setAssociationIniciatives(
        Array.from(
          new Set(
            filteredAssociations
              .flatMap(
                (association: Association) => association.iniciatives || []
              )
              .map((initiative: Iniciatives) => initiative.title)
              .filter(Boolean)
          )
        )
      );

      setAssociationName(
        filteredAssociations.map(
          (association: Association) => association?.association_name
        )
      );
      setIsLoading(false);
    } else {
      setAssociation(associations);
      setAssociationSource(associations);
      setFilterAssociation(associations);
      setAssociationIniciatives(
        associations
          .flatMap((association: Association) => association.iniciatives || [])
          .map((initiative: Iniciatives) => initiative.title)
          .filter(Boolean)
      );
      setAssociationName(
        associations.map(
          (association: Association) => association?.association_name
        )
      );
      setIsLoading(false);
    }
  };

  const filterBySearch = (query: string) => {
    if (query.trim() === "") {
      setAssociation(associationsSource);
      setFilterAssociation(associationsSource);
      return;
    }

    const filteredAssociations = associations.filter(
      (association: Association) => {
        const { association_name, iniciatives, email } = association;
        const lowerCaseQuery = query.toLowerCase();

        return (
          association_name?.toLowerCase().includes(lowerCaseQuery) ||
          iniciatives?.some(
            (iniciative) =>
              iniciative?.title &&
              iniciative.title.toLowerCase().includes(lowerCaseQuery)
          ) ||
          email?.toLowerCase().includes(lowerCaseQuery)
        );
      }
    );
    setAssociation(filteredAssociations);
    setFilterAssociation(filteredAssociations);
  };

  const handleSearch = (query: string) => {
    filterBySearch(query);
  };

  const handleFilterChange = (filteredAssociations: Association[]) => {
    setFilterAssociation(filteredAssociations);
  };

  const onClickRedirect = (userId: string) => {
    navigate(`/association/${userId}`);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className={styling.main}>
      <h1>Associations</h1>
      <p>Here you can find every association and its iniciatives</p>
      <div className={styling.filters}>
        <Searchbar
          placeholder="Search..."
          width={800}
          onSearch={handleSearch}
        />
        <div className={styling.filterDropdown}>
          <Filter
            options={associationNames}
            data={associations}
            placeholder="Associations"
            criteria="association_name"
            onFilterChange={handleFilterChange}
          />

          <Filter
            options={associationIniciatives}
            data={associations}
            placeholder="Iniciatives"
            criteria="iniciatives"
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>
      <div className={styling.cards}>
        {filterAssociations.map((association: Association, index) => (
          <AssociationCard
            key={index}
            avatar={association?.association_name}
            association={association}
            subheader={association?.email}
            onClickRedirect={() => onClickRedirect(association?.user_id)}
          />
        ))}
      </div>
    </div>
  );
};

export default Associations;
