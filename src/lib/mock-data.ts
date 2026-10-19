import type {
  Room,
  Tenant,
  Invoice,
  InvoiceComputed,
  InvoiceStatus,
  Payment,
  PaymentMethod,
} from "./types";

// Ngày "hôm nay" cố định để dữ liệu demo luôn nhất quán giữa server/client.
export const TODAY = "2026-10-19";

function mulberry32(seed: number) {
  let s = seed;
  return function () {
    s |= 0;
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(2026);

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(rand() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(rand() * (max - min + 1)) + min;
}
function randDigits(n: number): string {
  let s = "";
  for (let i = 0; i < n; i++) s += randInt(0, 9);
  return s;
}
// Dùng local date thay vì toISOString() để tránh lệch ngày khi múi giờ > UTC.
function toISODate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate(),
  ).padStart(2, "0")}`;
}
function addDays(iso: string, days: number): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + days);
  return toISODate(d);
}
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const SURNAMES = [
  "Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ",
  "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý",
];
const MIDDLE_MALE = ["Văn", "Hữu", "Minh", "Quốc", "Thành", "Đức", "Anh", "Tuấn", "Công"];
const MIDDLE_FEMALE = ["Thị", "Ngọc", "Thu", "Hồng", "Diệu", "Kim", "Thanh", "Phương"];
const GIVEN_MALE = [
  "Hùng", "Dũng", "Nam", "Long", "Sơn", "Phong", "Khang", "Bảo", "Tài",
  "Đạt", "Hiếu", "Khoa", "Minh", "Quân", "Thịnh", "Phúc", "Đăng", "Trung",
];
const GIVEN_FEMALE = [
  "Lan", "Hoa", "Mai", "Linh", "Trang", "Thảo", "Hương", "Nhi", "Vy",
  "Ngọc", "Huyền", "Diễm", "Quỳnh", "Yến", "Thắm", "Trinh", "My", "Anh",
];
const HOMETOWNS = [
  "Hà Nội", "Hải Phòng", "Thanh Hóa", "Nghệ An", "Hà Tĩnh", "Quảng Bình",
  "Nam Định", "Thái Bình", "Ninh Bình", "Phú Thọ", "Bắc Giang", "Vĩnh Phúc",
  "Huế", "Đà Nẵng", "Quảng Nam", "Bình Định", "Gia Lai", "Đắk Lắk",
  "Cần Thơ", "An Giang", "Đồng Tháp", "Tây Ninh",
];
const AMENITIES_POOL = [
  "Điều hòa", "Nóng lạnh", "Gác lửng", "Ban công", "Máy giặt chung",
  "Wifi miễn phí", "Để xe trong nhà", "Bếp riêng", "Tủ lạnh", "Cửa sổ lớn",
];
const PHONE_PREFIXES = [
  "032", "033", "034", "035", "037", "038", "039", "070", "079", "081",
  "082", "086", "088", "091", "094", "096", "097", "098",
];

function randomName(): string {
  const isMale = rand() < 0.5;
  const surname = pick(SURNAMES);
  const middle = isMale ? pick(MIDDLE_MALE) : pick(MIDDLE_FEMALE);
  const given = isMale ? pick(GIVEN_MALE) : pick(GIVEN_FEMALE);
  return `${surname} ${middle} ${given}`;
}
function randomPhone(): string {
  return `${pick(PHONE_PREFIXES)}${randDigits(7)}`;
}
function randomIdNumber(): string {
  return `0${randDigits(11)}`;
}

// ---------------------------------------------------------------------------
// Phòng
// ---------------------------------------------------------------------------

const FLOORS = [1, 2, 3];
const ROOMS_PER_FLOOR = 8;
const TOTAL_ROOMS = FLOORS.length * ROOMS_PER_FLOOR;

const roomOrder = shuffle(Array.from({ length: TOTAL_ROOMS }, (_, i) => i));
const EMPTY_COUNT = 4;
const MAINTENANCE_COUNT = 2;
const emptySet = new Set(roomOrder.slice(0, EMPTY_COUNT));
const maintenanceSet = new Set(roomOrder.slice(EMPTY_COUNT, EMPTY_COUNT + MAINTENANCE_COUNT));

export const rooms: Room[] = [];
let roomCounter = 0;
for (const floor of FLOORS) {
  for (let i = 1; i <= ROOMS_PER_FLOOR; i++) {
    const idx = roomCounter;
    const code = `P${floor}0${i}`;
    const area = randInt(16, 34);
    const maxOccupants = area >= 28 ? 3 : area >= 22 ? 2 : 1;
    const baseRent = floor === 1 ? 3_200_000 : floor === 2 ? 3_000_000 : 2_800_000;
    const rentPrice = baseRent + (area - 20) * 25_000;
    const amenities = shuffle(AMENITIES_POOL).slice(0, randInt(3, 6));
    let status: Room["status"] = "occupied";
    if (emptySet.has(idx)) status = "empty";
    else if (maintenanceSet.has(idx)) status = "maintenance";
    rooms.push({
      id: `room-${code}`,
      code,
      floor,
      area,
      maxOccupants,
      rentPrice: Math.round(rentPrice / 10_000) * 10_000,
      electricPrice: 3_500,
      waterPrice: 22_000,
      trashFee: 20_000,
      amenities,
      status,
      tenantId: null,
    });
    roomCounter++;
  }
}

// ---------------------------------------------------------------------------
// Khách thuê
// ---------------------------------------------------------------------------

type PayerType = "good" | "installment" | "slow" | "chronic";

function pickPayerType(): PayerType {
  const r = rand();
  if (r < 0.4) return "good";
  if (r < 0.7) return "installment";
  if (r < 0.9) return "slow";
  return "chronic";
}

export const tenants: Tenant[] = [];
const tenantPayerType = new Map<string, PayerType>();

for (const room of rooms) {
  if (room.status !== "occupied") continue;
  const monthsAgo = randInt(1, 20);
  const moveIn = addDays(TODAY, -monthsAgo * 30 - randInt(0, 20));
  const occupants = randInt(1, room.maxOccupants);
  const tenant: Tenant = {
    id: `tenant-${room.code}`,
    name: randomName(),
    phone: randomPhone(),
    idNumber: randomIdNumber(),
    roomId: room.id,
    moveInDate: moveIn,
    deposit: room.rentPrice,
    occupants,
    hometown: pick(HOMETOWNS),
  };
  tenants.push(tenant);
  room.tenantId = tenant.id;
  tenantPayerType.set(tenant.id, pickPayerType());
}

// ---------------------------------------------------------------------------
// Hóa đơn + thanh toán từng đợt
// ---------------------------------------------------------------------------

function monthsBetween(fromIso: string, toIso: string): string[] {
  const from = new Date(fromIso + "T00:00:00");
  const to = new Date(toIso + "T00:00:00");
  const periods: string[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), 1);
  const end = new Date(to.getFullYear(), to.getMonth(), 1);
  while (cursor <= end) {
    periods.push(
      `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`,
    );
    cursor.setMonth(cursor.getMonth() + 1);
  }
  return periods;
}

function periodToIssueDate(period: string): string {
  const [y, m] = period.split("-").map(Number);
  const next = new Date(y, m, 1); // month is 0-indexed -> this is day 1 of next month
  return toISODate(next);
}

function makePayment(date: string, amount: number): Payment {
  const method: PaymentMethod = rand() < 0.65 ? "transfer" : "cash";
  return {
    id: `pm-${date}-${Math.round(amount)}-${randDigits(4)}`,
    date,
    amount: Math.round(amount),
    method,
  };
}

export const invoices: Invoice[] = [];

// Tháng gần nhất đã lập hóa đơn = tháng trước tháng hiện tại (đã chốt điện nước)
const todayDate = new Date(TODAY + "T00:00:00");
const lastBilledPeriod = `${todayDate.getFullYear()}-${String(todayDate.getMonth()).padStart(2, "0")}`;
const lastBilledMonthStart = toISODate(new Date(todayDate.getFullYear(), todayDate.getMonth() - 1, 1));
const sixMonthsBeforeLast = toISODate(new Date(todayDate.getFullYear(), todayDate.getMonth() - 6, 1));

for (const tenant of tenants) {
  const room = rooms.find((r) => r.id === tenant.roomId)!;
  const historyStart = tenant.moveInDate > sixMonthsBeforeLast ? tenant.moveInDate : sixMonthsBeforeLast;
  const periods = monthsBetween(historyStart, lastBilledMonthStart);
  const payerType = tenantPayerType.get(tenant.id)!;

  let electricIndex = randInt(800, 2400);

  periods.forEach((period, idx) => {
    const issueDate = periodToIssueDate(period);
    const dueDate = addDays(issueDate, 24); // hạn đóng ~ngày 25 hàng tháng

    const usage = randInt(70, 220);
    const oldIndex = electricIndex;
    const newIndex = oldIndex + usage;
    electricIndex = newIndex;
    const electricAmount = usage * room.electricPrice;

    const waterUsage = randInt(3, 5) * tenant.occupants + randInt(0, 3);
    const waterAmount = waterUsage * room.waterPrice;

    const trashAmount = room.trashFee * tenant.occupants;

    const total = room.rentPrice + electricAmount + waterAmount + trashAmount;

    const isLast = idx === periods.length - 1;
    const isSecondLast = idx === periods.length - 2;
    const isThirdLast = idx === periods.length - 3;

    const payments: Payment[] = [];
    const invoiceId = `inv-${room.code}-${period}`;

    // Nếu tổng tỷ lệ ~1 thì khoản cuối hấp thụ phần dư làm tròn; nếu không,
    // khoản cuối chỉ đúng tỷ lệ của nó -> phần còn lại cố tình để nợ.
    const addSplit = (ratios: number[], baseDate: string, spreadDays: number, lateOk: boolean) => {
      const isFull = ratios.reduce((a, b) => a + b, 0) >= 0.999;
      let remaining = total;
      ratios.forEach((ratio, i) => {
        const isLastRatio = i === ratios.length - 1;
        const amount = isLastRatio && isFull ? remaining : Math.round(total * ratio);
        remaining -= amount;
        const dayOffset = Math.round((spreadDays / Math.max(1, ratios.length - 1)) * i) + randInt(0, 2);
        const payDate = addDays(baseDate, lateOk ? dayOffset : Math.min(dayOffset, 8));
        if (amount > 0) payments.push(makePayment(payDate, amount));
      });
    };

    switch (payerType) {
      case "good": {
        addSplit([1], issueDate, randInt(1, 6), false);
        break;
      }
      case "installment": {
        if (isLast) {
          // Đang đóng từng đợt, chưa xong đợt cuối
          addSplit([0.4, 0.3], issueDate, 14, true);
        } else {
          addSplit([0.4, 0.35, 0.25], issueDate, 20, true);
        }
        break;
      }
      case "slow": {
        if (isLast) {
          if (rand() < 0.5) addSplit([0.35], issueDate, 5, true);
          // else: chưa đóng gì -> unpaid/overdue
        } else if (isSecondLast) {
          addSplit([0.7], issueDate, 10, true);
        } else {
          addSplit([1], issueDate, 16, true);
        }
        break;
      }
      case "chronic": {
        if (isLast || isSecondLast || isThirdLast) {
          if (rand() < 0.4) addSplit([randInt(15, 30) / 100], issueDate, 6, true);
          // else: không đóng gì
        } else {
          addSplit([0.6, 0.4], issueDate, 22, true);
        }
        break;
      }
    }

    invoices.push({
      id: invoiceId,
      roomId: room.id,
      tenantId: tenant.id,
      period,
      issueDate,
      dueDate,
      rent: room.rentPrice,
      electricity: {
        oldIndex,
        newIndex,
        unitPrice: room.electricPrice,
        amount: electricAmount,
      },
      water: {
        usage: waterUsage,
        unitPrice: room.waterPrice,
        amount: waterAmount,
      },
      trash: trashAmount,
      other: 0,
      payments,
    });
  });
}

// ---------------------------------------------------------------------------
// Computed helpers
// ---------------------------------------------------------------------------

export function computeInvoice(invoice: Invoice): InvoiceComputed {
  const total = invoice.rent + invoice.electricity.amount + invoice.water.amount + invoice.trash + invoice.other;
  const paid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
  const remaining = total - paid;
  let status: InvoiceStatus;
  if (remaining <= 0) status = "paid";
  else if (invoice.dueDate < TODAY) status = "overdue";
  else if (paid > 0) status = "partial";
  else status = "unpaid";
  return { ...invoice, total, paid, remaining, status };
}

export const invoicesComputed: InvoiceComputed[] = invoices.map(computeInvoice);

export function getRoom(id: string): Room | undefined {
  return rooms.find((r) => r.id === id);
}
export function getTenant(id: string): Tenant | undefined {
  return tenants.find((t) => t.id === id);
}
export function getTenantByRoom(roomId: string): Tenant | undefined {
  return tenants.find((t) => t.roomId === roomId);
}
export function getInvoicesByTenant(tenantId: string): InvoiceComputed[] {
  return invoicesComputed
    .filter((i) => i.tenantId === tenantId)
    .sort((a, b) => (a.period < b.period ? 1 : -1));
}
export function getInvoicesByRoom(roomId: string): InvoiceComputed[] {
  return invoicesComputed
    .filter((i) => i.roomId === roomId)
    .sort((a, b) => (a.period < b.period ? 1 : -1));
}
export function getInvoice(id: string): InvoiceComputed | undefined {
  return invoicesComputed.find((i) => i.id === id);
}

export { lastBilledPeriod };
