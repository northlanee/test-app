import { Dispatch, SetStateAction, useState } from "react";
import { Card, Button } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { IItem } from "../App";

export const ItemCard: React.FC<{
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
