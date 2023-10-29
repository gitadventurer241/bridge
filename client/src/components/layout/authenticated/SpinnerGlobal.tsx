import LoadingGIF from "../../../media/loading.svg";
import styling from "./SpinnerGlobal.module.css";

const SpinnerGlobal: React.FC = () => {
  return (
    <div
      className={styling.loading}
      style={{ height: "90vh" }}
    >
      <img src={LoadingGIF} alt="Loading" style={{ width: "100px" }} />
    </div>
  );
};

export { SpinnerGlobal };
