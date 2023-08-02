import { Dispatch, SetStateAction, useState } from "react";
import { IClient } from "../App";
import { Button, Card } from "antd";
import { CloseOutlined } from "@ant-design/icons";

export const ClientCard: React.FC<{
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
