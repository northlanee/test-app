import { Dispatch, SetStateAction, useState } from "react";
import { IClient } from "../App";
import { api } from "../axios-instance";
import { Input, Modal } from "antd";

const defaultItem = {
  name: "",
  phone: "",
  emails: [],
};

export const AddItemModal: React.FC<{
  addOpen: boolean;
  setAddOpen: Dispatch<SetStateAction<boolean>>;
  setClients: Dispatch<SetStateAction<IClient[]>>;
}> = ({ addOpen, setAddOpen, setClients }) => {
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState<Partial<IClient>>(defaultItem);
  const [error, setError] = useState(false);

  const handleOk = async () => {
    setError(false);
    setLoading(true);
    if (
      !newItem.name ||
      !newItem.phone ||
      (newItem.emails && !newItem.emails[0])
    ) {
      setLoading(false);
      setError(true);
      return;
    }
    const res = await api.post("clients", newItem);
    if (res.status === 201) {
      setClients((prev) => [...prev, res.data]);
      setNewItem(defaultItem);
    }
    setAddOpen(false);
    setLoading(false);
  };

  const handleCancel = () => {
    setAddOpen(false);
  };

  return (
    <>
      <Modal
        title="Title"
        open={addOpen}
        onOk={handleOk}
        confirmLoading={loading}
        onCancel={handleCancel}
      >
        {error && (
          <div style={{ color: "red", marginBottom: "8px" }}>
            All fields required
          </div>
        )}
        <p>
          <Input
            placeholder="Name"
            value={newItem.name}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </p>
        <p>
          <Input
            placeholder="Phone"
            value={newItem.phone}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, phone: e.target.value }))
            }
          />
        </p>
        <p>
          <Input
            placeholder="Email"
            value={newItem.emails}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, emails: [e.target.value] }))
            }
          />
        </p>
      </Modal>
    </>
  );
};
