import * as xlsx from 'xlsx'
import { Result } from '@/types'

export function exportResultsToExcel(results: Result[]) {
  // 创建工作簿
  const wb = xlsx.utils.book_new()

  // 准备数据
  const exportData = results.map(result => ({
    '员工姓名': result.employee_name,
    '年度月平均工资': result.avg_salary,
    '缴费基数': result.contribution_base,
    '公司缴纳金额': result.company_fee,
    '计算时间': result.created_at ? new Date(result.created_at).toLocaleString('zh-CN') : ''
  }))

  // 创建工作表
  const ws = xlsx.utils.json_to_sheet(exportData, {
    header: [
      '员工姓名',
      '年度月平均工资',
      '缴费基数',
      '公司缴纳金额',
      '计算时间'
    ]
  })

  // 设置列宽
  const colWidths = [
    { wch: 15 }, // 员工姓名
    { wch: 15 }, // 年度月平均工资
    { wch: 12 }, // 缴费基数
    { wch: 15 }, // 公司缴纳金额
    { wch: 20 }  // 计算时间
  ]
  ws['!cols'] = colWidths

  // 添加工作表到工作簿
  xlsx.utils.book_append_sheet(wb, ws, '社保计算结果')

  // 导出文件
  const fileName = `社保计算结果_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.xlsx`
  xlsx.writeFile(wb, fileName)
}