import { Modal, Button, Input, Divider } from "antd";
import styling from "./AddInitiatives.module.css";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import {
  getAssociationById,
  updateAssociationById,
} from "../../../../../../api/associations";
import { Iniciatives } from "../../../../../../types/types";

interface AddInitiativesProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  callback?: () => void;
}

const AddInitiatives: React.FC<AddInitiativesProps> = ({
  visible,
  setVisible,
  callback,
}) => {
  const [association, setAssociation] = useState<any>({});
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [participants, setParticipants] = useState<string[]>([]);
  const [location_address, setLocationAddress] = useState<string>("");
  const [work_location, setWorkLocation] = useState<string>("");
  const [iniciatives, setIniciatives] = useState<Iniciatives[]>([]);
  const userId = JSON.parse(localStorage.getItem("auth") || "{}")?.user?.id;

  const cleanInputs = () => {
    setTitle("");
    setDescription("");
    setLink("");
    setParticipants([]);
    setLocationAddress("");
    setWorkLocation("");
  };

  const fetchInitiatives = async () => {
    const association = await getAssociationById(userId);
    const initiatives = association?.iniciatives || [];
    setIniciatives(initiatives);
    setAssociation(association);
  };

  const handleOk = async () => {
    // check if this association already has this initiative
    const initiativeExists = iniciatives?.filter(
      (initiative) =>
        initiative?.title &&
        initiative?.title?.length > 0 &&
        initiative?.title === title
    );

    if (initiativeExists && initiativeExists.length > 0) {
      return;
    }

    const payload = {
      associations: [userId],
      title,
      description,
      participants,
      location_address,
      work_location,
      link,
      date_created: new Date().toISOString(),
    };

    const updatedIniciatives = [...iniciatives, payload];
    const updateAssociation = {
      ...association,
      iniciatives: updatedIniciatives,
    };

    try {
      await updateAssociationById(userId, updateAssociation);

      if (callback) {
        callback();
      }
    } catch (error) {
      console.log("error");
    }
    cleanInputs();
    setVisible(false);
  };

  const onCancel = () => {
    cleanInputs();
    setVisible(false);
  };

  useEffect(() => {
    fetchInitiatives();
  }, []);

  return (
    <Modal
      className={styling.modal}
      open={visible}
      title="Add Initiative"
      onOk={handleOk}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" onClick={handleOk}>
          Update
        </Button>,
      ]}
    >
      <div className={styling.container}>
        <div className={styling.inputContainer}>
          <Divider>Title</Divider>
          <Input
            className={styling.input}
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styling.inputContainer}>
          <Divider>Description</Divider>
          <TextArea
            className={styling.description}
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className={styling.rowContainer}>
          <div className={styling.width}>
            <Divider>Work arrangement</Divider>
            <Input
              className={styling.input}
              type="text"
              placeholder="Remote, in person, etc."
              value={work_location}
              onChange={(e) => setWorkLocation(e.target.value)}
            />
          </div>
          <div className={styling.width}>
            <Divider>Location address</Divider>
            <Input
              className={styling.input}
              type="text"
              placeholder="Location address"
              value={location_address}
              onChange={(e) => setLocationAddress(e.target.value)}
            />
          </div>
        </div>
        <div className={styling.inputContainer}>
          <Divider>Participants</Divider>
          <Input
            className={styling.input}
            type="text"
            placeholder="Add participants: name name name"
            value={participants.join(", ")}
            onChange={(e) => setParticipants(e.target.value.split(", "))}
          />
        </div>
        <div className={styling.inputContainer}>
          <Divider>Link</Divider>
          <Input
            className={styling.input}
            type="text"
            placeholder="Link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
      </div>
    </Modal>
  );
};

export { AddInitiatives };
