import { Input } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "antd";
import { IItem } from "../App";
import { api } from "../axios-instance";
import { ItemCard } from "./ItemCard";
import { AddItemModal } from "./AddItemModal";

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
