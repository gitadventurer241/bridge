import { useEffect, useState } from "react";
import styling from "./SpinnerTimeout.module.css";
import LoadingGIF from "../../../media/loading.svg";

const SpinnerTimeout = () => {
  const [count, setCount] = useState(3);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount: number) => --currentCount);
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [count]);

  return (
    <div className={styling.loading} style={{ height: "10vh" }}>
      <img src={LoadingGIF} alt="Loading" style={{ width: "5rem" }} />
    </div>
  );
};

export default SpinnerTimeout;
