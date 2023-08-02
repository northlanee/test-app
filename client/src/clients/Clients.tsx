import { Dispatch, SetStateAction, useState } from "react";
import { IClient } from "../App";
import { api } from "../axios-instance";
import { Input, Button } from "antd";
import { AddItemModal } from "./AddItemModal";
import { ClientCard } from "./ClientCard";

const { Search } = Input;

export const Client: React.FC<{
  clients: IClient[];
  setClients: Dispatch<SetStateAction<IClient[]>>;
}> = ({ clients, setClients }) => {
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
    const res = await api.get(`clients/${idInput}`);
    setLoading(false);
    if (res.status === 200) {
      setClients((prev) => [...prev, res.data]);
    }
  };

  const removeClient = async (
    idx: number,
    setRemoveLoading: Dispatch<SetStateAction<boolean>>
  ) => {
    setRemoveLoading(true);
    const res = await api.delete(`clients/${clients[idx].id}`);
    setRemoveLoading(false);
    if (res.status === 200) {
      setClients((prev) => {
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
        setClients={setClients}
      />
      <Button
        type="primary"
        style={{ marginBottom: "12px" }}
        onClick={() => setAddOpen(true)}
      >
        Add Client
      </Button>
      <Search
        value={idInput}
        onChange={(e) => setIdInput(e.target.value)}
        placeholder="Client search by ID"
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
      {clients.length > 0 &&
        clients.map((client, idx) => (
          <ClientCard
            client={client}
            removeClient={removeClient}
            idx={idx}
            key={idx}
          />
        ))}
    </div>
  );
};
