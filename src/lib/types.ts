export type RoomStatus = "occupied" | "empty" | "maintenance";

export type Room = {
  id: string;
  code: string;
  floor: number;
  area: number;
  maxOccupants: number;
  rentPrice: number;
  electricPrice: number;
  waterPrice: number;
  trashFee: number;
  amenities: string[];
  status: RoomStatus;
  tenantId: string | null;
};

export type Tenant = {
  id: string;
  name: string;
  phone: string;
  idNumber: string;
  roomId: string;
  moveInDate: string;
  deposit: number;
  occupants: number;
  hometown: string;
  note?: string;
};

export type PaymentMethod = "cash" | "transfer";

export type Payment = {
  id: string;
  date: string;
  amount: number;
  method: PaymentMethod;
  note?: string;
};

export type ElectricityItem = {
  oldIndex: number;
  newIndex: number;
  unitPrice: number;
  amount: number;
};

export type WaterItem = {
  usage: number;
  unitPrice: number;
  amount: number;
};

export type Invoice = {
  id: string;
  roomId: string;
  tenantId: string;
  period: string; // "2026-09"
  issueDate: string;
  dueDate: string;
  rent: number;
  electricity: ElectricityItem;
  water: WaterItem;
  trash: number;
  other: number;
  otherNote?: string;
  payments: Payment[];
};

export type InvoiceStatus = "paid" | "partial" | "overdue" | "unpaid";

export type InvoiceComputed = Invoice & {
  total: number;
  paid: number;
  remaining: number;
  status: InvoiceStatus;
};
