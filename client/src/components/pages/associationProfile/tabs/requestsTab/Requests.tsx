import { Association } from "../../../../../types/types";
import { CardContainer } from "../../../../UI/container/CardContainer";
import styling from "./Requests.module.scss";
import ApprovalTable from "./components/ApprovalTable";

const RequestsComponent = ({ association }: { association: Association }) => {
  
  return (
    <CardContainer className={styling.requestsTab}>
      <h1 className={styling.titleTables}>Approval requests</h1>
      <ApprovalTable association={association} />
    </CardContainer>
  );
};

export default RequestsComponent;
