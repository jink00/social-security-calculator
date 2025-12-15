import { supabase } from './supabase'
import { City, Salary, Result } from '@/types'

export async function calculateSocialSecurity(): Promise<void> {
  try {
    // 1. 获取佛山的城市标准（默认2024年）
    const { data: cityData, error: cityError } = await supabase
      .from('cities')
      .select('*')
      .eq('city_name', '佛山')
      .single()

    if (cityError) {
      console.error('获取城市标准失败:', cityError)
      throw cityError
    }

    // 2. 获取所有员工工资数据
    const { data: salaryData, error: salaryError } = await supabase
      .from('salaries')
      .select('*')

    if (salaryError) {
      console.error('获取工资数据失败:', salaryError)
      throw salaryError
    }

    // 3. 按员工分组计算月平均工资
    const employeeGroups: { [key: string]: { total: number; count: number } } = {}

    salaryData.forEach(salary => {
      if (!employeeGroups[salary.employee_name]) {
        employeeGroups[salary.employee_name] = { total: 0, count: 0 }
      }
      employeeGroups[salary.employee_name].total += salary.salary_amount
      employeeGroups[salary.employee_name].count += 1
    })

    // 4. 计算每位员工的结果
    const results: Omit<Result, 'id'>[] = []

    for (const [employeeName, data] of Object.entries(employeeGroups)) {
      const avgSalary = data.total / data.count

      // 确定缴费基数
      let contributionBase: number
      if (avgSalary < cityData.base_min) {
        contributionBase = cityData.base_min
      } else if (avgSalary > cityData.base_max) {
        contributionBase = cityData.base_max
      } else {
        contributionBase = avgSalary
      }

      // 计算公司缴纳金额
      const companyFee = contributionBase * cityData.rate

      results.push({
        employee_name: employeeName,
        avg_salary: Math.round(avgSalary * 100) / 100, // 保留两位小数
        contribution_base: Math.round(contributionBase * 100) / 100,
        company_fee: Math.round(companyFee * 100) / 100
      })
    }

    // 5. 清空结果表
    const { error: deleteError } = await supabase
      .from('results')
      .delete()
      .neq('id', -1)

    if (deleteError) {
      console.error('清空结果表失败:', deleteError)
      throw deleteError
    }

    // 6. 插入新的计算结果
    const { error: insertError } = await supabase
      .from('results')
      .insert(results)

    if (insertError) {
      console.error('插入计算结果失败:', insertError)
      throw insertError
    }

    console.log(`成功计算并存储了 ${results.length} 位员工的社保数据`)
  } catch (error) {
    console.error('社保计算过程中出错:', error)
    throw error
  }
}