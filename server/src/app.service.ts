import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AddUserDto } from './dtos/addUserDto';
import { AddItemDto } from './dtos/addItemDto';
import { AddInvoiceDto } from './dtos/addInvoiceDto';

export interface Client {
  id: string;
  name: string;
  phone: string;
  emails: string[];
}

export interface Item {
  name: string;
  description: string;
  price: number;
  currency: string;
}

@Injectable()
export class AppService {
  constructor(private httpService: HttpService) {}

  async getToken(session: Record<string, any>) {
    if (!session.token) {
      const url = `${process.env.API_BASE_URL}/account/token`;
      const { data } = await firstValueFrom(
        this.httpService.post(url, {
          id: process.env.API_KEY,
          secret: process.env.SECRET_KEY,
        }),
      );

      session.token = data.token;
      return data.token;
    }
    return session.token;
  }

  async getClient(token: string, id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<Client>(
        `${process.env.API_BASE_URL}/clients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
    return data;
  }

  async addClient(token: string, user: AddUserDto) {
    const { data } = await firstValueFrom(
      this.httpService.post<Client>(
        `${process.env.API_BASE_URL}/clients`,
        user,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
    return data;
  }

  async deleteClient(token: string, id: string) {
    const { data } = await firstValueFrom(
      this.httpService.delete<Client>(
        `${process.env.API_BASE_URL}/clients/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
    return data;
  }

  async getItem(token: string, id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get<Item>(`${process.env.API_BASE_URL}/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    return data;
  }

  async addItem(token: string, user: AddItemDto) {
    const { data } = await firstValueFrom(
      this.httpService.post<Item>(`${process.env.API_BASE_URL}/items`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    return data;
  }

  async deleteItem(token: string, id: string) {
    const { data } = await firstValueFrom(
      this.httpService.delete<Item>(`${process.env.API_BASE_URL}/items/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    return data;
  }

  async addInvoice(token: string, body: AddInvoiceDto): Promise<string> {
    const { client, item } = body;

    const { data } = await firstValueFrom(
      this.httpService.post(
        `${process.env.API_BASE_URL}/documents`,
        {
          type: 320,
          payment: [
            {
              type: 0,
              price: item.price,
              currency: item.currency,
            },
          ],
          client: {
            self: false,
            emails: client.emails,
            id: client.id,
          },
          income: {
            price: item.price,
            currency: item.currency,
            quantity: 1,
            description: item.description,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      ),
    );
    return data;
  }

  async getInvoice(token: string, id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`${process.env.API_BASE_URL}/documents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    );
    return data;
  }
}
