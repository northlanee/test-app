import { Client } from "./clients/Clients";
import { Invoice } from "./Invoice";
import { useState } from "react";
import { Item } from "./items/Items";

export interface IClient {
  id: string;
  name: string;
  phone: string;
  emails: string[];
}

export interface IItem {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
}

export interface IInvoice {
  id: string;
  client: IClient;
  item: IItem;
  payment: {
    name: string;
    price: number;
  };
}

function App() {
  const [clients, setClients] = useState<IClient[]>([]);
  const [items, setItems] = useState<IItem[]>([]);
  const [invoices, setInvoices] = useState<IInvoice[]>([]);

  console.log(invoices);

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Item items={items} setItems={setItems} />
      <Client clients={clients} setClients={setClients} />
      <Invoice
        items={items}
        clients={clients}
        invoices={invoices}
        setInvoices={setInvoices}
      />
    </div>
  );
}

export default App;
