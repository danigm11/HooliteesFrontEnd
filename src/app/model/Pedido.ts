import { ProductPedido } from "./ProductPedido";
import { Transaction } from "./Transaction";

export interface Pedido{
  transaction: Transaction,
  products: ProductPedido[]
}