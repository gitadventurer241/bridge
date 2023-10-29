import styling from "./ProgressBar.module.css";

interface ProgressBarProps {
  progress: number;
  height?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = "2rem",
}) => {
  return (
    <div>
      <div className={styling.progressBar} style={{ height: height }}>
        <div
          className={styling.progressCompleted}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export { ProgressBar };
