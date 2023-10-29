import { Spin } from "antd";
import styling from "./Spinner.module.css";

const Spinner = () => {
  return (
    <div className={styling.main}>
      <Spin size="large" />
    </div>
  );
};

export default Spinner;
