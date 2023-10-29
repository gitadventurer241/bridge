import styling from "./SpinnerTimeout.module.css";
import LoadingGIF from "../../../media/login-loading.svg";

const SpinnerLogin = () => {

  return (
    <div className={styling.loading} >
      <img src={LoadingGIF} alt="Loading" style={{ height: "2rem" }} />
    </div>
  );
};

export default SpinnerLogin;
