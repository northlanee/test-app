import { Input } from "antd";
import { Dispatch, SetStateAction, useState } from "react";
import { api } from "./axios-instance";
import { Card, Button, Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { IClient } from "./App";

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

const ClientCard: React.FC<{
  client: IClient;
  removeClient: (
    idx: number,
    setRemoveLoading: Dispatch<SetStateAction<boolean>>
  ) => void;
  idx: number;
}> = ({ client, removeClient, idx }) => {
  const [removeLoading, setRemoveLoading] = useState(false);

  return (
    <Card
      title={
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {client.name}
          <Button
            type="primary"
            icon={<CloseOutlined />}
            loading={removeLoading}
            onClick={() => removeClient(idx, setRemoveLoading)}
            danger
          />
        </div>
      }
      bordered={true}
      style={{ marginBottom: "4px" }}
      key={idx}
    >
      <p>
        <strong>Phone: </strong>
        {client.phone}
      </p>
      <p>
        <strong>Emails: </strong>
        {client.emails.map((e) => (
          <p>{e}</p>
        ))}
      </p>
    </Card>
  );
};

const defaultItem = {
  name: "",
  phone: "",
  emails: [],
};

const AddItemModal: React.FC<{
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
