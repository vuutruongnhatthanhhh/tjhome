import { rooms } from "@/lib/mock-data";
import { formatCurrency } from "@/lib/format";
import {
  getOccupancy,
  getOutstandingSummary,
  getTopDebtors,
  getDashboardHeadline,
  getVacantRooms,
  totalTenants,
} from "@/lib/stats";

export type QaItem = {
  id: string;
  question: string;
  keywords: string[];
  answer: () => string;
};

export const QA_ITEMS: QaItem[] = [
  {
    id: "vacant-rooms",
    question: "Phòng nào đang trống?",
    keywords: ["phòng trống", "trống", "còn phòng", "phòng nào trống", "phòng nào còn"],
    answer: () => {
      const vacant = getVacantRooms();
      if (vacant.length === 0) {
        return "Hiện tại nhà trọ đã kín phòng, không còn phòng trống nào ạ 🎉";
      }
      const list = vacant.map((r) => `• ${r.code} — ${formatCurrency(r.rentPrice)}/tháng`).join("\n");
      return `Hiện có ${vacant.length} phòng trống:\n${list}\n\nAnh xem chi tiết ở tab Phòng nhé.`;
    },
  },
  {
    id: "top-debtor",
    question: "Ai đang nợ tiền nhiều nhất?",
    keywords: ["nợ nhiều nhất", "nợ nhiều", "khách nợ", "ai nợ", "nợ tiền"],
    answer: () => {
      const top = getTopDebtors(3);
      if (top.length === 0) {
        return "Hiện không có khách nào nợ tiền, tất cả đều đã thanh toán đầy đủ 🎉";
      }
      const list = top
        .map((d, i) => `${i + 1}. ${d.tenant.name} (${d.room.code}) — nợ ${formatCurrency(d.amount)}`)
        .join("\n");
      return `Top khách nợ nhiều nhất:\n${list}`;
    },
  },
  {
    id: "revenue-this-month",
    question: "Doanh thu tháng này bao nhiêu?",
    keywords: ["doanh thu", "thu được bao nhiêu", "doanh thu tháng"],
    answer: () => {
      const { thisMonth, delta } = getDashboardHeadline();
      const trend = delta >= 0 ? "tăng" : "giảm";
      return `Doanh thu thực thu tháng này (tính đến hiện tại) là ${formatCurrency(
        thisMonth.revenue,
      )}, ${trend} ${Math.abs(Math.round(delta * 100))}% so với tháng trước.`;
    },
  },
  {
    id: "overdue",
    question: "Có bao nhiêu hóa đơn quá hạn?",
    keywords: ["quá hạn", "hóa đơn quá hạn", "trễ hạn"],
    answer: () => {
      const s = getOutstandingSummary();
      if (s.overdueCount === 0) return "Hiện không có hóa đơn nào quá hạn 🎉";
      return `Hiện có ${s.overdueCount} hóa đơn quá hạn, tổng cộng ${formatCurrency(
        s.overdueAmount,
      )} cần nhắc khách đóng gấp.`;
    },
  },
  {
    id: "occupancy",
    question: "Tỷ lệ lấp đầy hiện tại?",
    keywords: ["lấp đầy", "tỷ lệ phòng", "bao nhiêu phòng đang thuê", "còn mấy phòng"],
    answer: () => {
      const o = getOccupancy();
      return `Đang cho thuê ${o.occupied}/${o.total} phòng (${Math.round(
        o.rate * 100,
      )}%). Còn ${o.empty} phòng trống và ${o.maintenance} phòng đang sửa chữa.`;
    },
  },
  {
    id: "total-debt",
    question: "Tổng nợ hiện tại là bao nhiêu?",
    keywords: ["tổng nợ", "còn nợ bao nhiêu", "công nợ"],
    answer: () => {
      const s = getOutstandingSummary();
      return `Tổng công nợ hiện tại là ${formatCurrency(s.totalOutstanding)}, nằm ở ${
        s.unpaidInvoiceCount
      } hóa đơn chưa thu đủ.`;
    },
  },
  {
    id: "tenant-count",
    question: "Đang có bao nhiêu khách thuê?",
    keywords: ["bao nhiêu khách", "số khách thuê", "khách thuê"],
    answer: () => `Hiện có ${totalTenants} khách đang thuê trên tổng số ${rooms.length} phòng.`,
  },
];

const FALLBACK_ANSWERS = [
  "Em chưa có dữ liệu để trả lời câu này. Anh thử bấm vào một trong các câu hỏi gợi ý bên dưới nhé 🙏",
  "Hmm, em chưa hiểu rõ ý anh. Anh chọn nhanh một câu hỏi mẫu bên dưới giúp em nha.",
];

export function resolveAnswer(input: string): string {
  const q = input.trim().toLowerCase();
  if (!q) return FALLBACK_ANSWERS[0];

  let best: QaItem | null = null;
  let bestScore = 0;
  for (const item of QA_ITEMS) {
    let score = 0;
    for (const kw of item.keywords) {
      if (q.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      best = item;
    }
  }
  if (best) return best.answer();
  return FALLBACK_ANSWERS[Math.floor(Math.random() * FALLBACK_ANSWERS.length)];
}
