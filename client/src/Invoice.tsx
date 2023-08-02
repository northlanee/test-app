import { Dispatch, SetStateAction, useState } from "react";
import { IClient, IInvoice, IItem } from "./App";
import { Button, Select, Input, Card } from "antd";
import { api } from "./axios-instance";

const { Search } = Input;

export const Invoice: React.FC<{
  items: IItem[];
  clients: IClient[];
  invoices: IInvoice[];
  setInvoices: Dispatch<SetStateAction<IInvoice[]>>;
}> = ({ items, clients, invoices, setInvoices }) => {
  const [selectedItem, setSelectedItem] = useState<null | IItem>(null);
  const [selectedClient, setSelectedClient] = useState<null | IClient>(null);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [idInput, setIdInput] = useState("");
  const [idLoading, setIdLoading] = useState(false);

  const onChangeItem = (value: number) => {
    setSelectedItem(items[value]);
  };

  const onChangeClient = (value: number) => {
    setSelectedClient(clients[value]);
  };

  const submitInvoice = async () => {
    setShowError(false);
    if (!selectedItem || !selectedClient) {
      setShowError(true);
    } else {
      setLoading(true);
      const res = await api.post("invoice", {
        client: selectedClient,
        item: selectedItem,
      });
      if (res.status === 201) {
        console.log(res.data);
        setInvoices((prev) => [
          ...prev,
          {
            id: res.data.id,
            item: selectedItem,
            client: selectedClient,
            payment: {
              name: selectedItem.name,
              price: selectedItem.price,
            },
          },
        ]);
      }
      setLoading(false);
    }
  };

  const getInvoiceSubmit = async () => {
    setIdInput("");
    setIdLoading(true);
    const res = await api.get(`invoice/${idInput}`);
    setIdLoading(false);
    if (res.status === 200) {
      setInvoices((prev) => [
        ...prev,
        {
          id: res.data.id,
          item: res.data.income[0],
          client: res.data.client,
          payment: res.data.payment[0],
        },
      ]);
    }
  };

  return (
    <div style={{ width: "30%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <Select
          placeholder="Select item"
          onChange={onChangeItem}
          options={items.map((i, idx) => ({ value: idx, label: i.name }))}
          style={{ width: "45%" }}
        />
        <Select
          placeholder="Select client"
          onChange={onChangeClient}
          options={clients.map((i, idx) => ({ value: idx, label: i.name }))}
          style={{ width: "45%" }}
        />
      </div>
      <Button
        type="primary"
        style={{ width: "100%", marginBottom: "8px" }}
        loading={loading}
        onClick={submitInvoice}
      >
        Create invoice
      </Button>
      {showError && (
        <span style={{ color: "red", marginBottom: "12px" }}>
          Item and client should be selected
        </span>
      )}
      <SearchBar
        idInput={idInput}
        setIdInput={setIdInput}
        idLoading={idLoading}
        getInvoiceSubmit={getInvoiceSubmit}
      />
      {invoices.map((i, idx) => {
        return (
          <Card
            title={
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {i.payment.name}
              </div>
            }
            bordered={true}
            style={{ marginBottom: "4px" }}
            key={idx}
          >
            <p>
              <strong>Client: </strong>
              {i.client.name}
            </p>
            <p>
              <strong>Item: </strong>
              {i.item.name}
            </p>
          </Card>
        );
      })}
    </div>
  );
};

const SearchBar: React.FC<{
  idInput: string;
  setIdInput: Dispatch<SetStateAction<string>>;
  idLoading: boolean;
  getInvoiceSubmit: () => Promise<void>;
}> = ({ idInput, setIdInput, idLoading, getInvoiceSubmit }) => {
  return (
    <Search
      value={idInput}
      onChange={(e) => setIdInput(e.target.value)}
      placeholder="Invoice search by ID"
      enterButton="Search"
      size="large"
      loading={idLoading}
      onSearch={getInvoiceSubmit}
      style={{ marginBottom: "12px" }}
    />
  );
};
