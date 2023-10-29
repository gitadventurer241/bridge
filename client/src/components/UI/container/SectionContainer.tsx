import { useState } from "react";
import { Section } from "../../../types/types";
import styling from "./SectionContainer.module.css";
import { IconCertificate, IconClipboardText } from "@tabler/icons-react";
import UnderConstruction from "../../shared/underConstruction/UnderConstruction";

interface ContentBlockProps {
  customClass?: string;
  sections: Section[];
  width?: string;
}

const ContentBlock: React.FC<ContentBlockProps> = ({
  sections,
  customClass,
  width,
}) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const toggleConstructionModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <div className={`${styling.containerVisibleInfo} ${customClass}`}>
      {sections &&
        sections?.map((section, index) => (
          <div key={index} className={styling.inOneRow}>
            <div className={styling.section} style={{ width: width }}>
              <p className={styling.title}>{section.title}</p>
              {section.type === "cv" ? (
                <IconCertificate
                  size={50}
                  stroke={0.5}
                  color="black"
                  onClick={toggleConstructionModal}
                />
              ) : null}
              {section.type === "certificate" ? (
                <IconClipboardText
                  size={50}
                  stroke={0.5}
                  color="black"
                  onClick={toggleConstructionModal}
                />
              ) : null}
              {section.subtitle && (
                <p className={styling.subtitle}>
                  <strong>{section.subtitle}</strong>
                </p>
              )}
              {section.text && (
                <p className={styling.text}>
                  <strong>{section.text}</strong>
                </p>
              )}
              {section.subtext && (
                <p className={styling.subtext}>{section.subtext}</p>
              )}
            </div>
            {index < sections.length - 1 && <HorizontalLine />}
          </div>
        ))}
      <UnderConstruction
        subtitle="Visualization of documents coming soon!"
        isOpen={isModalOpen}
        onClose={toggleConstructionModal}
      />
    </div>
  );
};

interface HorizontalLineProps {
  customClass?: string;
}

const HorizontalLine: React.FC<HorizontalLineProps> = ({ customClass }) => (
  <hr className={`${styling.horizontalLine} ${customClass}`} />
);

export { ContentBlock, HorizontalLine };
