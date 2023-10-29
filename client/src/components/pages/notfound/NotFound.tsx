import React from "react";
import styling from "./NotFound.module.css";
import image from "../../../media/not-found.svg";

interface NotFoundProps {
  link?: string;
}

const NotFound: React.FC<NotFoundProps> = ({ link }) => {
  return (
    <div className={styling.notFound}>
      <div className={styling.notFoundContent}>
        <h1>404 - Page Not Found</h1>
        <p>
          Oops! It seems like you've taken a wrong turn in your job search
          journey.
        </p>
        <p>Don't worry, we'll help you get back on track!</p>
        <img src={image} alt="Lost Job Seeker" />
      </div>
    </div>
  );
};

export default NotFound;
