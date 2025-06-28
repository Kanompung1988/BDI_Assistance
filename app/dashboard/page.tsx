"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Users,
  ShoppingCart,
  BarChart3,
  PieChart,
  Calendar,
  Target,
  Award,
  AlertCircle,
  RefreshCw,
  Eye,
  Heart,
  Clock,
  MapPin,
} from "lucide-react"

interface BusinessMetrics {
  revenue: {
    current: number
    previous: number
    growth: number
  }
  customers: {
    total: number
    new: number
    returning: number
    conversionRate: number
    lifetimeValue: number
  }
  roi: {
    percentage: number
    investment: number
    returns: number
  }
  sales: {
    today: number
    thisWeek: number
    thisMonth: number
    target: number
  }
  performance: {
    pageViews: number
    engagement: number
    avgSessionTime: number
    bounceRate: number
  }
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<BusinessMetrics | null>(null)
  const [selectedPeriod, setSelectedPeriod] = useState("thisMonth")
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [isRefreshing, setIsRefreshing] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetchBusinessMetrics()

    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      fetchBusinessMetrics(true)
    }, 300000)

    return () => clearInterval(interval)
  }, [])

  const fetchBusinessMetrics = async (isAutoRefresh = false) => {
    if (!isAutoRefresh) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }

    // Simulate API call with realistic data variations
    setTimeout(
      () => {
        const baseRevenue = 2850000
        const variation = (Math.random() - 0.5) * 100000

        setMetrics({
          revenue: {
            current: baseRevenue + variation,
            previous: 2450000,
            growth: 16.3 + (Math.random() - 0.5) * 2,
          },
          customers: {
            total: 1247 + Math.floor(Math.random() * 20),
            new: 89 + Math.floor(Math.random() * 10),
            returning: 1158,
            conversionRate: 3.2 + (Math.random() - 0.5) * 0.5,
            lifetimeValue: 15600 + Math.floor(Math.random() * 1000),
          },
          roi: {
            percentage: 24.5 + (Math.random() - 0.5) * 2,
            investment: 5000000,
            returns: 6225000 + Math.floor(Math.random() * 100000),
          },
          sales: {
            today: 45000 + Math.floor(Math.random() * 10000),
            thisWeek: 285000,
            thisMonth: 1150000,
            target: 50000,
          },
          performance: {
            pageViews: 12450 + Math.floor(Math.random() * 500),
            engagement: 68.5 + (Math.random() - 0.5) * 5,
            avgSessionTime: 4.2 + (Math.random() - 0.5) * 0.5,
            bounceRate: 32.1 + (Math.random() - 0.5) * 3,
          },
        })
        setLastUpdate(new Date())
        setIsLoading(false)
        setIsRefreshing(false)
      },
      isAutoRefresh ? 500 : 1500,
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency: "THB",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("th-TH").format(num)
  }

  const formatPercentage = (num: number) => {
    return `${num.toFixed(1)}%`
  }

  // Mock chart data with some variation
  const revenueChartData = [
    { month: "ม.ค.", revenue: 2100000 },
    { month: "ก.พ.", revenue: 2300000 },
    { month: "มี.ค.", revenue: 2450000 },
    { month: "เม.ย.", revenue: 2650000 },
    { month: "พ.ค.", revenue: metrics?.revenue.current || 2850000 },
  ]

  const customerSegmentData = [
    { segment: "ลูกค้าใหม่", percentage: 35, color: "bg-blue-500", count: metrics?.customers.new || 89 },
    { segment: "ลูกค้าเก่า", percentage: 45, color: "bg-green-500", count: metrics?.customers.returning || 1158 },
    { segment: "ลูกค้า VIP", percentage: 20, color: "bg-purple-500", count: 250 },
  ]

  const performanceMetrics = [
    {
      label: "Page Views",
      value: metrics?.performance.pageViews || 0,
      icon: Eye,
      color: "blue",
      suffix: " views",
    },
    {
      label: "Engagement Rate",
      value: metrics?.performance.engagement || 0,
      icon: Heart,
      color: "red",
      suffix: "%",
    },
    {
      label: "Avg Session Time",
      value: metrics?.performance.avgSessionTime || 0,
      icon: Clock,
      color: "green",
      suffix: " min",
    },
    {
      label: "Bounce Rate",
      value: metrics?.performance.bounceRate || 0,
      icon: TrendingUp,
      color: "orange",
      suffix: "%",
    },
  ]

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">กำลังโหลดข้อมูลธุรกิจ...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-800 to-indigo-800 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white rounded-2xl p-3 shadow-lg">
                <BarChart3 className="h-8 w-8 text-purple-800" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Business Dashboard</h1>
                <p className="text-purple-200 text-lg">แดชบอร์ดวิเคราะห์ธุรกิจ</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => fetchBusinessMetrics()}
                disabled={isRefreshing}
                className="bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2 text-white flex items-center space-x-2 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                <span>รีเฟรช</span>
              </button>
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-xl px-4 py-2 text-white"
              >
                <option value="today">วันนี้</option>
                <option value="thisWeek">สัปดาห์นี้</option>
                <option value="thisMonth">เดือนนี้</option>
                <option value="thisYear">ปีนี้</option>
              </select>
              <button
                onClick={() => router.push("/maps")}
                className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-purple-200 hover:text-white transition-colors"
              >
                ดูแผนที่
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex items-center space-x-2 text-purple-200 hover:text-white transition-colors hover:bg-white/10 px-6 py-3 rounded-xl"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>กลับหน้าหลัก</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Real-time Status */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-4 mb-8 border-2 border-green-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-800 font-semibold">สถานะ: อัปเดตแบบเรียลไทม์</span>
            </div>
            <div className="text-green-700 text-sm">อัปเดตล่าสุด: {lastUpdate.toLocaleTimeString("th-TH")}</div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Revenue */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 rounded-2xl p-3">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="flex items-center space-x-1 text-green-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">+{formatPercentage(metrics?.revenue.growth || 0)}</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">รายได้รวม</h3>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics?.revenue.current || 0)}</p>
            <p className="text-sm text-gray-500 mt-1">เทียบกับเดือนที่แล้ว</p>
          </div>

          {/* Customers */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 rounded-2xl p-3">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex items-center space-x-1 text-blue-600">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-semibold">+{metrics?.customers.new}</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">ลูกค้าทั้งหมด</h3>
            <p className="text-2xl font-bold text-blue-600">{formatNumber(metrics?.customers.total || 0)}</p>
            <p className="text-sm text-gray-500 mt-1">ลูกค้าใหม่ {metrics?.customers.new} คน</p>
          </div>

          {/* ROI */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 rounded-2xl p-3">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <div className="flex items-center space-x-1 text-purple-600">
                <Award className="h-4 w-4" />
                <span className="text-sm font-semibold">ดีเยี่ยม</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">ROI</h3>
            <p className="text-2xl font-bold text-purple-600">{formatPercentage(metrics?.roi.percentage || 0)}</p>
            <p className="text-sm text-gray-500 mt-1">ผลตอบแทนการลงทุน</p>
          </div>

          {/* Sales */}
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 rounded-2xl p-3">
                <ShoppingCart className="h-8 w-8 text-orange-600" />
              </div>
              <div className="flex items-center space-x-1 text-orange-600">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-semibold">วันนี้</span>
              </div>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">ยอดขายวันนี้</h3>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(metrics?.sales.today || 0)}</p>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((metrics?.sales.today || 0) / (metrics?.sales.target || 50000)) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">เป้าหมาย {formatCurrency(metrics?.sales.target || 50000)}</p>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => {
            const IconComponent = metric.icon
            return (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`bg-${metric.color}-100 rounded-xl p-2`}>
                    <IconComponent className={`h-6 w-6 text-${metric.color}-600`} />
                  </div>
                  <h4 className="font-semibold text-gray-900">{metric.label}</h4>
                </div>
                <p className={`text-xl font-bold text-${metric.color}-600`}>
                  {typeof metric.value === "number" ? metric.value.toFixed(1) : metric.value}
                  {metric.suffix}
                </p>
              </div>
            )
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Chart */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span>แนวโน้มรายได้ 5 เดือนล่าสุด</span>
            </h3>
            <div className="space-y-4">
              {revenueChartData.map((data, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{data.month}</div>
                  <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-6 rounded-full transition-all duration-500"
                      style={{ width: `${(data.revenue / 3000000) * 100}%` }}
                    ></div>
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-white">
                      {formatCurrency(data.revenue)}
                    </div>
                  </div>
                  {index === revenueChartData.length - 1 && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">ปัจจุบัน</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Customer Segments */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-3">
              <PieChart className="h-6 w-6 text-green-600" />
              <span>กลุ่มลูกค้า</span>
            </h3>
            <div className="space-y-6">
              {customerSegmentData.map((segment, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">{segment.segment}</span>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">{segment.percentage}%</span>
                      <span className="text-sm text-gray-500">({formatNumber(segment.count)} คน)</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`${segment.color} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${segment.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced KPIs */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <Target className="h-8 w-8 text-purple-600" />
            <span>ตัวชี้วัดขั้นสูง</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-2xl p-6 mb-4">
                <Users className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Conversion Rate</h4>
              <p className="text-2xl font-bold text-blue-600">
                {formatPercentage(metrics?.customers.conversionRate || 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">อัตราการแปลงลูกค้า</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-2xl p-6 mb-4">
                <DollarSign className="h-12 w-12 text-green-600 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Customer LTV</h4>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(metrics?.customers.lifetimeValue || 0)}
              </p>
              <p className="text-sm text-gray-500 mt-1">มูลค่าลูกค้าตลอดชีวิต</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-2xl p-6 mb-4">
                <Award className="h-12 w-12 text-purple-600 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">Profit Margin</h4>
              <p className="text-2xl font-bold text-purple-600">18.5%</p>
              <p className="text-sm text-gray-500 mt-1">อัตรากำไรสุทธิ</p>
            </div>
          </div>
        </div>

        {/* ROI Analysis */}
        <div className="bg-white rounded-2xl shadow-xl p-10 mb-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-8 flex items-center space-x-3">
            <Target className="h-8 w-8 text-purple-600" />
            <span>การวิเคราะห์ ROI</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-2xl p-6 mb-4">
                <DollarSign className="h-12 w-12 text-blue-600 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">เงินลงทุนเริ่มต้น</h4>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(metrics?.roi.investment || 0)}</p>
            </div>
            <div className="text-center">
              <div className="bg-green-100 rounded-2xl p-6 mb-4">
                <TrendingUp className="h-12 w-12 text-green-600 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">ผลตอบแทนรวม</h4>
              <p className="text-2xl font-bold text-green-600">{formatCurrency(metrics?.roi.returns || 0)}</p>
            </div>
            <div className="text-center">
              <div className="bg-purple-100 rounded-2xl p-6 mb-4">
                <Award className="h-12 w-12 text-purple-600 mx-auto" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-2">ROI</h4>
              <p className="text-2xl font-bold text-purple-600">{formatPercentage(metrics?.roi.percentage || 0)}</p>
            </div>
          </div>
          <div className="mt-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200">
            <h4 className="font-semibold text-purple-800 mb-2">💡 การวิเคราะห์ ROI</h4>
            <p className="text-purple-700 text-sm">
              ROI ของคุณอยู่ที่ {formatPercentage(metrics?.roi.percentage || 0)} ซึ่งถือว่าดีมาก! เมื่อเทียบกับอุตสาหกรรมเดียวกันที่มี ROI
              เฉลี่ย 15-20% แนะนำให้คงกลยุทธ์ปัจจุบันและขยายการลงทุนในช่องทางที่ให้ผลตอบแทนสูง
            </p>
          </div>
        </div>

        {/* Business Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Recommendations */}
          <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-8 border-2 border-green-200">
            <h3 className="text-2xl font-bold text-green-900 mb-6 flex items-center space-x-3">
              <Award className="h-6 w-6" />
              <span>คำแนะนำเชิงธุรกิจ</span>
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">📈 เพิ่มการตลาดออนไลน์</h4>
                <p className="text-green-700 text-sm">
                  ลูกค้าใหม่เพิ่มขึ้น {metrics?.customers.new} คน แนะนำให้เพิ่มงบการตลาดดิจิทัล 15%
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">💰 ปรับปรุงกระบวนการขาย</h4>
                <p className="text-green-700 text-sm">
                  ROI {formatPercentage(metrics?.roi.percentage || 0)} ดีมาก แต่ยังสามารถเพิ่มได้โดยลดต้นทุนการดำเนินงาน
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">🎯 โฟกัสลูกค้า VIP</h4>
                <p className="text-green-700 text-sm">ลูกค้า VIP 20% สร้างรายได้ 40% ควรมีโปรแกรมพิเศษ</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold text-green-800 mb-2">📱 พัฒนาแอปมือถือ</h4>
                <p className="text-green-700 text-sm">
                  Engagement Rate {formatPercentage(metrics?.performance.engagement || 0)}{" "}
                  แนะนำให้พัฒนาแอปเพื่อเพิ่มการมีส่วนร่วม
                </p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-8 border-2 border-orange-200">
            <h3 className="text-2xl font-bold text-orange-900 mb-6 flex items-center space-x-3">
              <AlertCircle className="h-6 w-6" />
              <span>การแจ้งเตือน</span>
            </h3>
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-yellow-400">
                <h4 className="font-semibold text-orange-800 mb-2">⚠️ ยอดขายวันนี้</h4>
                <p className="text-orange-700 text-sm">
                  ยอดขาย {formatCurrency(metrics?.sales.today || 0)}
                  {(metrics?.sales.today || 0) < (metrics?.sales.target || 50000) ? " ต่ำกว่าเป้าหมาย" : " บรรลุเป้าหมายแล้ว"}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-400">
                <h4 className="font-semibold text-orange-800 mb-2">📊 ข้อมูลอัปเดต</h4>
                <p className="text-orange-700 text-sm">ข้อมูลลูกค้าอัปเดตล่าสุด {Math.floor(Math.random() * 60)} นาทีที่แล้ว</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-400">
                <h4 className="font-semibold text-orange-800 mb-2">✅ เป้าหมายเดือน</h4>
                <p className="text-orange-700 text-sm">บรรลุเป้าหมายรายได้เดือนนี้แล้ว 95%</p>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-400">
                <h4 className="font-semibold text-orange-800 mb-2">🔔 การแจ้งเตือนใหม่</h4>
                <p className="text-orange-700 text-sm">
                  Bounce Rate {formatPercentage(metrics?.performance.bounceRate || 0)} ควรปรับปรุง UX
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">การดำเนินการด่วน</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button
              onClick={() => router.push("/maps")}
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-xl font-semibold transition-colors flex items-center space-x-2"
            >
              <MapPin className="h-5 w-5" />
              <span>ดูแผนที่การจราจร</span>
            </button>
            <button
              onClick={() => router.push("/business")}
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-xl font-semibold transition-colors flex items-center space-x-2"
            >
              <BarChart3 className="h-5 w-5" />
              <span>วิเคราะห์ธุรกิจ</span>
            </button>
            <button
              onClick={() => router.push("/investment")}
              className="bg-green-600 hover:bg-green-700 text-white p-4 rounded-xl font-semibold transition-colors flex items-center space-x-2"
            >
              <TrendingUp className="h-5 w-5" />
              <span>แผนการลงทุน</span>
            </button>
            <button
              onClick={() => router.push("/carbon-tracker")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-xl font-semibold transition-colors flex items-center space-x-2"
            >
              <Target className="h-5 w-5" />
              <span>คาร์บอนเครดิต</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
