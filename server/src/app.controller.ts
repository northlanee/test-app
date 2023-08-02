import {
  Controller,
  Get,
  Param,
  Session,
  Post,
  Body,
  Delete,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AddUserDto } from './dtos/addUserDto';
import { AddItemDto } from './dtos/addItemDto';
import { AddInvoiceDto } from './dtos/addInvoiceDto';

@Controller('/')
export class AppController {
  constructor(private appService: AppService) {}

  @Get('/clients/:id')
  async getClient(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const token = await this.appService.getToken(session);
    const client = await this.appService.getClient(token, id);
    return client;
  }

  @Post('/clients')
  async addClient(
    @Session() session: Record<string, any>,
    @Body() body: AddUserDto,
  ) {
    const token = await this.appService.getToken(session);
    const client = await this.appService.addClient(token, body);
    return client;
  }

  @Delete('/clients/:id')
  async deleteClient(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const token = await this.appService.getToken(session);
    const client = await this.appService.deleteClient(token, id);
    return client;
  }

  @Get('/items/:id')
  async getItem(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const token = await this.appService.getToken(session);
    const item = await this.appService.getItem(token, id);
    return item;
  }

  @Post('/items')
  async addItem(
    @Session() session: Record<string, any>,
    @Body() body: AddItemDto,
  ) {
    const token = await this.appService.getToken(session);
    const item = await this.appService.addItem(token, body);
    return item;
  }

  @Delete('/items/:id')
  async deleteItem(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const token = await this.appService.getToken(session);
    const item = await this.appService.deleteItem(token, id);
    return item;
  }

  @Post('/invoice')
  async addInvoice(
    @Session() session: Record<string, any>,
    @Body() body: AddInvoiceDto,
  ) {
    const token = await this.appService.getToken(session);
    const item = await this.appService.addInvoice(token, body);
    return item;
  }

  @Get('/invoice/:id')
  async getInvoice(
    @Param('id') id: string,
    @Session() session: Record<string, any>,
  ) {
    const token = await this.appService.getToken(session);
    const invoice = await this.appService.getInvoice(token, id);
    return invoice;
  }
}
