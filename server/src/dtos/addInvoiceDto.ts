import { IsObject } from 'class-validator';
import { Client, Item } from 'src/app.service';

export class AddInvoiceDto {
  @IsObject()
  client: Client;

  @IsObject()
  item: Item;
}
