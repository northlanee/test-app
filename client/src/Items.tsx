import { Input } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { api } from "./axios-instance";
import { Card, Button, Modal, InputNumber } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { IItem } from "./App";

const { Search } = Input;

export const Item: React.FC<{
  items: IItem[];
  setItems: Dispatch<SetStateAction<IItem[]>>;
}> = ({ items, setItems }) => {
  const [idInput, setIdInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const [addOpen, setAddOpen] = useState(false);

  const getItemSubmit = async () => {
    setError(false);
    if (!idInput) {
      setError(true);
      return;
    }
    setIdInput("");
    setLoading(true);
    const res = await api.get(`items/${idInput}`);
    setLoading(false);
    if (res.status === 200) {
      setItems((prev) => [...prev, res.data]);
    }
  };

  const removeItem = async (
    idx: number,
    setRemoveLoading: Dispatch<SetStateAction<boolean>>
  ) => {
    setRemoveLoading(true);
    const res = await api.delete(`items/${items[idx].id}`);
    setRemoveLoading(false);
    if (res.status === 200) {
      setItems((prev) => {
        const newArr = [...prev];
        newArr.splice(idx, 1);
        return newArr;
      });
    }
  };

  return (
    <div style={{ width: "30%" }}>
      <AddItemModal
        addOpen={addOpen}
        setAddOpen={setAddOpen}
        setItems={setItems}
      />
      <Button
        type="primary"
        style={{ marginBottom: "12px" }}
        onClick={() => setAddOpen(true)}
      >
        Add Item
      </Button>
      <Search
        value={idInput}
        onChange={(e) => setIdInput(e.target.value)}
        placeholder="Item search by ID"
        enterButton="Search"
        size="large"
        loading={loading}
        onSearch={getItemSubmit}
        style={{ marginBottom: "12px" }}
      />
      {error && (
        <div style={{ color: "red", marginBottom: "8px" }}>
          ID field is empty
        </div>
      )}
      {items.length > 0 &&
        items.map((item, idx) => (
          <ItemCard item={item} removeItem={removeItem} idx={idx} key={idx} />
        ))}
    </div>
  );
};

const ItemCard: React.FC<{
  item: IItem;
  removeItem: (
    idx: number,
    setRemoveLoading: Dispatch<SetStateAction<boolean>>
  ) => void;
  idx: number;
}> = ({ item, removeItem, idx }) => {
  const [removeLoading, setRemoveLoading] = useState(false);

  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {item.name}
          <Button
            type="primary"
            icon={<CloseOutlined />}
            loading={removeLoading}
            onClick={() => removeItem(idx, setRemoveLoading)}
            danger
          />
        </div>
      }
      bordered={true}
      style={{ marginBottom: "4px" }}
      key={idx}
    >
      <p>
        <strong>Description: </strong>
        {item.description}
      </p>
      <p>
        <strong>Price: </strong>
        {item.price}
      </p>
      <p>
        <strong>Currency: </strong>
        {item.currency}
      </p>
    </Card>
  );
};

const defaultItem = {
  name: "",
  description: "",
  price: 0,
  currency: "",
};

const AddItemModal: React.FC<{
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
