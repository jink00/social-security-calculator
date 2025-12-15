'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getSupabase } from '@/lib/supabase'
import { parseCitiesExcel, parseSalariesExcel } from '@/lib/excel-parser'
import { calculateSocialSecurity } from '@/lib/calculator'
import { City, Salary } from '@/types'

export default function UploadPage() {
  const [citiesFile, setCitiesFile] = useState<File | null>(null)
  const [salariesFile, setSalariesFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | '' | 'info'
    message: string
  }>({ type: '', message: '' })

  const showStatus = (type: 'success' | 'error' | 'info', message: string) => {
    setStatus({ type, message })
    setTimeout(() => setStatus({ type: '', message: '' }), 5000)
  }

  const handleCitiesUpload = async () => {
    if (!citiesFile) {
      showStatus('error', '请选择城市标准文件')
      return
    }

    setLoading(true)
    try {
      // 解析 Excel 文件
      const cities = await parseCitiesExcel(citiesFile)
      const supabase = getSupabase()

      // 清空 cities 表
      const { error: deleteError } = await supabase
        .from('cities')
        .delete()
        .neq('id', -1)

      if (deleteError) {
        throw deleteError
      }

      // 插入新数据
      const { error: insertError } = await supabase
        .from('cities')
        .insert(cities)

      if (insertError) {
        throw insertError
      }

      showStatus('success', `成功上传 ${cities.length} 条城市标准数据`)
    } catch (error: any) {
      console.error('上传城市标准失败:', error)
      showStatus('error', error.message || '上传失败')
    } finally {
      setLoading(false)
    }
  }

  const handleSalariesUpload = async () => {
    if (!salariesFile) {
      showStatus('error', '请选择员工工资文件')
      return
    }

    setLoading(true)
    try {
      // 解析 Excel 文件
      const salaries = await parseSalariesExcel(salariesFile)
      const supabase = getSupabase()

      // 清空 salaries 表
      const { error: deleteError } = await supabase
        .from('salaries')
        .delete()
        .neq('id', -1)

      if (deleteError) {
        throw deleteError
      }

      // 插入新数据
      const { error: insertError } = await supabase
        .from('salaries')
        .insert(salaries)

      if (insertError) {
        throw insertError
      }

      showStatus('success', `成功上传 ${salaries.length} 条员工工资数据`)
    } catch (error: any) {
      console.error('上传工资数据失败:', error)
      showStatus('error', error.message || '上传失败')
    } finally {
      setLoading(false)
    }
  }

  const handleCalculate = async () => {
    setLoading(true)
    try {
      await calculateSocialSecurity()
      showStatus('success', '计算完成！已更新结果数据')
    } catch (error: any) {
      console.error('计算失败:', error)
      showStatus('error', error.message || '计算失败')
    } finally {
      setLoading(false)
    }
  }

  const handleClearAll = async () => {
    if (!confirm('确定要清空所有数据吗？此操作不可恢复。')) {
      return
    }

    setLoading(true)
    try {
      // 清空所有表
      const supabase = getSupabase()
      const tables = ['cities', 'salaries', 'results']
      for (const table of tables) {
        const { error } = await supabase
          .from(table)
          .delete()
          .neq('id', -1)

        if (error) {
          throw error
        }
      }

      showStatus('success', '已清空所有数据')
      setCitiesFile(null)
      setSalariesFile(null)
    } catch (error: any) {
      console.error('清空数据失败:', error)
      showStatus('error', error.message || '清空失败')
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
            <h1 className="text-2xl font-bold text-gray-900">数据上传与管理</h1>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Status Message */}
      {status.message && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6`}>
          <div
            className={`p-4 rounded-lg ${
              status.type === 'success'
                ? 'bg-green-50 text-green-800'
                : status.type === 'error'
                ? 'bg-red-50 text-red-800'
                : 'bg-blue-50 text-blue-800'
            }`}
          >
            {status.message}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Cities Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              1. 上传城市标准数据
            </h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setCitiesFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="cities-file"
                    disabled={loading}
                  />
                  <label
                    htmlFor="cities-file"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    选择文件 (cities.xlsx)
                  </label>
                  {citiesFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      已选择: {citiesFile.name}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleCitiesUpload}
                disabled={!citiesFile || loading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '上传中...' : '上传城市标准'}
              </button>
            </div>
          </div>

          {/* Salaries Upload */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              2. 上传员工工资数据
            </h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={(e) => setSalariesFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="salaries-file"
                    disabled={loading}
                  />
                  <label
                    htmlFor="salaries-file"
                    className="cursor-pointer inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    选择文件 (salaries.xlsx)
                  </label>
                  {salariesFile && (
                    <p className="mt-2 text-sm text-gray-600">
                      已选择: {salariesFile.name}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleSalariesUpload}
                disabled={!salariesFile || loading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? '上传中...' : '上传工资数据'}
              </button>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              3. 执行计算
            </h2>
            <p className="text-gray-600 mb-4">
              点击下方按钮，系统将根据上传的数据自动计算每位员工的社保公积金费用
            </p>
            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '计算中...' : '执行计算并存储结果'}
            </button>
          </div>

          {/* Clear All Button */}
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              危险操作
            </h2>
            <p className="text-gray-600 mb-4">
              清空所有数据将删除城市标准、员工工资和计算结果的所有记录
            </p>
            <button
              onClick={handleClearAll}
              disabled={loading}
              className="w-full py-2 px-4 border border-red-600 rounded-md shadow-sm text-sm font-medium text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '处理中...' : '清空所有数据'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}