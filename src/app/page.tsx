import { Wallet, AlertTriangle, CircleDollarSign, Building2 } from "lucide-react";
import { PageHeader } from "@/components/ui-extra/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RevenueBreakdownBar } from "@/components/dashboard/revenue-breakdown-bar";
import { TopDebtorsList } from "@/components/dashboard/top-debtors-list";
import { RecentPaymentsList } from "@/components/dashboard/recent-payments-list";
import { VacantRoomsCard } from "@/components/dashboard/vacant-rooms-card";
import {
  getMonthlyRevenue,
  getRevenueBreakdown,
  getTopDebtors,
  getRecentPayments,
  getVacantRooms,
  getOutstandingSummary,
  getOccupancy,
  getDashboardHeadline,
  totalTenants,
} from "@/lib/stats";
import { lastBilledPeriod } from "@/lib/mock-data";
import { formatCurrency, formatPeriodLabel } from "@/lib/format";

export default function DashboardPage() {
  const months = getMonthlyRevenue(8);
  const headline = getDashboardHeadline();
  const outstanding = getOutstandingSummary();
  const occupancy = getOccupancy();
  const breakdown = getRevenueBreakdown(lastBilledPeriod);
  const debtors = getTopDebtors(6);
  const recentPayments = getRecentPayments(8);
  const vacantRooms = getVacantRooms();

  return (
    <div>
      <PageHeader
        title="Tổng quan"
        description={`Nhà trọ TJ Home · ${totalTenants} khách thuê · Cập nhật 19/10/2026`}
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard
          label="Doanh thu tháng 10"
          value={formatCurrency(headline.thisMonth.revenue)}
          icon={Wallet}
          delta={headline.delta}
        />
        <StatCard
          label="Tổng nợ hiện tại"
          value={formatCurrency(outstanding.totalOutstanding)}
          icon={CircleDollarSign}
          tone="warning"
          hint={`${outstanding.unpaidInvoiceCount} hóa đơn chưa thu đủ`}
        />
        <StatCard
          label="Quá hạn thanh toán"
          value={formatCurrency(outstanding.overdueAmount)}
          icon={AlertTriangle}
          tone="critical"
          hint={`${outstanding.overdueCount} hóa đơn quá hạn`}
        />
        <StatCard
          label="Tỷ lệ lấp đầy"
          value={`${occupancy.occupied}/${occupancy.total} phòng`}
          icon={Building2}
          tone="good"
          hint={`${Math.round(occupancy.rate * 100)}% phòng đang cho thuê`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-6">
        <div className="lg:col-span-3 rounded-2xl border border-border bg-card p-4 md:p-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold">Doanh thu thực thu theo tháng</h2>
          </div>
          <p className="text-xs text-muted-foreground mb-2">8 tháng gần nhất</p>
          <RevenueChart data={months} />
        </div>

        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-4 md:p-5">
          <h2 className="text-sm font-semibold mb-1">Cơ cấu hóa đơn</h2>
          <p className="text-xs text-muted-foreground mb-4">{formatPeriodLabel(lastBilledPeriod)}</p>
          <RevenueBreakdownBar data={breakdown} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <h2 className="text-sm font-semibold mb-1">Khách nợ nhiều nhất</h2>
          <p className="text-xs text-muted-foreground mb-1">Cần nhắc thu trong tuần này</p>
          <TopDebtorsList debtors={debtors} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
          <h2 className="text-sm font-semibold mb-1">Giao dịch gần đây</h2>
          <p className="text-xs text-muted-foreground mb-1">Các khoản thanh toán mới nhất</p>
          <RecentPaymentsList payments={recentPayments} />
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-4 md:p-5">
        <h2 className="text-sm font-semibold mb-1">Phòng trống</h2>
        <p className="text-xs text-muted-foreground mb-4">Cơ hội cho thuê, liên hệ sớm</p>
        <VacantRoomsCard rooms={vacantRooms} />
      </div>
    </div>
  );
}
