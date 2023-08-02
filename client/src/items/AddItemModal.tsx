import { Input } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { Modal, InputNumber } from "antd";
import { IItem } from "../App";
import { api } from "../axios-instance";

const defaultItem = {
  name: "",
  description: "",
  price: 0,
  currency: "",
};

export const AddItemModal: React.FC<{
  addOpen: boolean;
  setAddOpen: Dispatch<SetStateAction<boolean>>;
  setItems: Dispatch<SetStateAction<IItem[]>>;
}> = ({ addOpen, setAddOpen, setItems }) => {
  const [loading, setLoading] = useState(false);
  const [newItem, setNewItem] = useState<Partial<IItem>>(defaultItem);
  const [error, setError] = useState(false);

  const handleOk = async () => {
    setError(false);
    setLoading(true);
    if (
      !newItem.name ||
      !newItem.description ||
      !newItem.price ||
      !newItem.currency
    ) {
      setLoading(false);
      setError(true);
      return;
    }
    const res = await api.post("items", newItem);
    if (res.status === 201) {
      setItems((prev) => [...prev, res.data]);
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
            placeholder="Description"
            value={newItem.description}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, description: e.target.value }))
            }
          />
        </p>
        <p>
          <InputNumber
            placeholder="Price"
            value={newItem.price}
            onChange={(e) => setNewItem((prev) => ({ ...prev, price: e || 0 }))}
            min={0}
          />
        </p>
        <p>
          <Input
            placeholder="Currency"
            value={newItem.currency}
            onChange={(e) =>
              setNewItem((prev) => ({ ...prev, currency: e.target.value }))
            }
          />
        </p>
      </Modal>
    </>
  );
};
