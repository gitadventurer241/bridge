import React, { useEffect, useState } from "react";
import { Modal, Input, Select, Divider, Button } from "antd";
// import { Button } from "../../../UI/button/Button";
import { IconEdit } from "@tabler/icons-react";
import { Candidate, EditInputProps } from "../../../../types/types";
import { CloseCircleOutlined } from "@ant-design/icons";
import styling from "./EditInput.module.css";
const { Option } = Select;

enum LanguageLevelText {
  Look = "Looking for a job",
  NotLook = "Not looking for a job",
}

const linkOptions = [
  "LinkedIn",
  "Github",
  "Portfolio",
  "Personal Website",
  "Other",
];

const EditInput: React.FC<EditInputProps<Candidate>> = ({
  onSave,
  showModal,
  setVisible,
  setValuesToEdit,
  visible,
  candidate,
  fieldsToDisplay, // Array of nicely formatted fields to display
  fieldKeysToEdit, // Array of keys of the fields to edit
}) => {
  // State
  const [values, setValues] = useState({} as Candidate);
  const [links, setLinks] = useState([{ name: "", url: "" }]);
  const [selectedLinkName, setSelectedLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");

  /**
   * Save the values to edit
   */
  const handleSave = () => {
    setValuesToEdit(values);
    onSave && onSave(values);
    setVisible(false);
  };

  /**
   * Close the modal
   */
  const onCancel = () => {
    setLinkUrl("");
    setSelectedLinkName("");
    setVisible(false);
  };

  const addLink = () => {
    const newLink = { name: selectedLinkName, url: linkUrl };
    setLinks([...links, newLink]);
    setValues((prevCandidate) => ({
      ...prevCandidate,
      links: Array.isArray(prevCandidate.links)
        ? [...prevCandidate.links, newLink]
        : [newLink],
    }));
    setSelectedLinkName("");
    setLinkUrl("");
  };

  /**
   * Set the values to edit when the modal is opened
   */
  useEffect(() => {
    setValues(candidate);
    setLinks(
      candidate.links
        ? (candidate.links as { name: string; url: string }[])
        : []
    );
  }, [candidate]);

  return (
    <>
      <IconEdit
        color="black"
        style={{ cursor: "pointer" }}
        onClick={showModal}
      />

      <Modal
        open={visible}
        title="Edit Information"
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={handleSave}>
            Save
          </Button>,
        ]}
      >
        {fieldKeysToEdit &&
          fieldKeysToEdit?.map((field: string, index) => (
            <div key={index}>
              <Divider>{fieldsToDisplay[index]}</Divider>
              {(() => {
                switch (field) {
                  case "job_status":
                    return (
                      <Select
                        style={{ width: "100%" }}
                        placeholder="Job Status"
                        value={(values && values[field]) || ""}
                        onChange={(value) => {
                          setValues((prevValues) => ({
                            ...prevValues,
                            [field]: value,
                          }));
                        }}
                      >
                        {Object.entries(LanguageLevelText).map(
                          ([level, text]) => (
                            <Option key={level} value={text}>
                              {text}
                            </Option>
                          )
                        )}
                      </Select>
                    );
                  case "links":
                    return (
                      <div>
                        {links && links.length > 0 && <p>Links:</p>}
                        {links &&
                          links?.map((link, index) => (
                            <div key={index} className={styling.buttonAddLink}>
                              {/* Show existing links */}
                              <Input
                                value={link.name}
                                onChange={(e) => {
                                  const updatedLinks = [...links];
                                  updatedLinks[index].name = e.target.value;
                                  setLinks(updatedLinks);
                                }}
                                placeholder="Link Name"
                                disabled={true}
                              />
                              <Input
                                value={link.url}
                                placeholder="Link URL"
                                onChange={(e) => {
                                  const updatedLinks = [...links];
                                  updatedLinks[index].url = e.target.value;
                                  setLinks(updatedLinks);
                                }}
                              />

                              <Button
                                danger
                                className={styling.buttonAddLink}
                                onClick={() => {
                                  // Handle link deletion here
                                  const updatedLinks = [...links];
                                  updatedLinks.splice(index, 1);
                                  setLinks(updatedLinks);
                                  setValues((prevValues) => ({
                                    ...prevValues,
                                    links: updatedLinks,
                                  }));
                                }}
                              >
                                Delete Link
                              </Button>
                            </div>
                          ))}
                        <div>
                          <p>Additional Link:</p>
                          <Select
                            placeholder="Link Name"
                            value={selectedLinkName}
                            onChange={(value) => {
                              setSelectedLinkName(value);
                            }}
                            style={{ minWidth: "100%" }}
                          >
                            {linkOptions.map((linkOption) => (
                              <Select.Option
                                key={linkOption}
                                value={linkOption}
                              >
                                {linkOption}
                              </Select.Option>
                            ))}
                          </Select>
                          <Input
                            className={styling.inputLink}
                            placeholder="Link URL"
                            value={linkUrl}
                            onChange={(e) => {
                              setLinkUrl(e.target.value);
                            }}
                          />
                          <Button
                            className={styling.buttonAddLink}
                            onClick={addLink}
                          >
                            Add Link
                          </Button>
                        </div>
                      </div>
                    );
                  default:
                    return (
                      <Input
                        value={
                          (values &&
                            (values[field as keyof Candidate] as string)) ||
                          ""
                        }
                        placeholder={fieldsToDisplay[index]}
                        onChange={(e) => {
                          setValues((prevValues) => ({
                            ...prevValues,
                            [field]: e.target.value,
                          }));
                        }}
                      />
                    );
                }
              })()}
            </div>
          ))}
      </Modal>
    </>
  );
};

export { EditInput };
