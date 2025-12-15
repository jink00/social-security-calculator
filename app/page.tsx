import Card from '@/components/Card'
import {
  DocumentArrowUpIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-900">
              五险一金计算器
            </h1>
            <p className="text-gray-600">
              轻松计算员工社保公积金费用
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Description */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            选择您要执行的操作
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            上传城市标准和员工工资数据，系统将自动计算每位员工的社保公积金费用
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:gap-12 max-w-4xl mx-auto">
          <Card
            title="数据上传"
            description="上传城市标准数据（cities.xlsx）和员工工资数据（salaries.xlsx）"
            href="/upload"
            icon={<DocumentArrowUpIcon className="h-6 w-6" />}
          />
          <Card
            title="结果查询"
            description="查看社保计算结果，支持搜索和导出为Excel文件"
            href="/results"
            icon={<TableCellsIcon className="h-6 w-6" />}
          />
        </div>

        {/* Instructions */}
        <div className="mt-16 bg-white rounded-lg shadow-md p-8 max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            使用说明
          </h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">城市标准文件 (cities.xlsx)</h4>
              <p className="text-gray-600 text-sm">
                需要包含字段：city_name（城市名）、year（年份）、base_min（基数下限）、
                base_max（基数上限）、rate（综合缴纳比例）
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">员工工资文件 (salaries.xlsx)</h4>
              <p className="text-gray-600 text-sm">
                需要包含字段：employee_id（员工工号）、employee_name（员工姓名）、
                month（年月）、salary_amount（工资金额）
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-500 text-sm">
            © 2024 五险一金计算器. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
