'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getSupabase } from '@/lib/supabase'
import { Result } from '@/types'
import Table from '@/components/Table'

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    fetchResults()
  }, [refreshTrigger])

  const fetchResults = async () => {
    try {
      setLoading(true)
      const supabase = getSupabase()

      const { data, error } = await supabase
        .from('results')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('获取结果失败:', error)
      } else {
        setResults(data || [])
      }
    } catch (error) {
      console.error('获取结果时出错:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              返回主页
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">计算结果查询</h1>
            <Link
              href="/upload"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              前往上传
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">员工总数</h3>
            <p className="text-3xl font-bold text-blue-600">
              {results.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">月均工资</h3>
            <p className="text-3xl font-bold text-green-600">
              ¥{results.length > 0
                ? ((results.reduce((sum, r) => sum + r.avg_salary, 0) / results.length)
                  .toLocaleString('zh-CN', { minimumFractionDigits: 2 }))
                : '0'}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">月均缴费</h3>
            <p className="text-3xl font-bold text-indigo-600">
              ¥{results.length > 0
                ? ((results.reduce((sum, r) => sum + r.company_fee, 0) / results.length)
                  .toLocaleString('zh-CN', { minimumFractionDigits: 2 }))
                : '0'}
            </p>
          </div>
        </div>

        {/* Results Table */}
        <Table data={results} loading={loading} />
      </main>
    </div>
  )
}