import * as xlsx from 'xlsx'
import { City, Salary } from '@/types'

export function parseCitiesExcel(file: File): Promise<City[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = xlsx.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[]

        if (jsonData.length < 2) {
          reject(new Error('城市标准文件格式错误：没有数据'))
          return
        }

        // 获取表头并清理（去除空格，转为小写）
        const headers = (jsonData[0] as string[]).map(h =>
          h ? h.trim().toLowerCase().replace(/\s+/g, '_') : ''
        )

        console.log('解析到的表头:', headers)
        console.log('原始表头:', jsonData[0])

        // 查找列索引（支持多种可能的列名）
        const findColumnIndex = (possibleNames: string[]) => {
          for (const name of possibleNames) {
            const index = headers.findIndex(h => h.includes(name))
            if (index !== -1) return index
          }
          return -1
        }

        const cityIndex = findColumnIndex(['city_name', 'city_namte', '城市名称', '城市名'])
        const yearIndex = findColumnIndex(['year', '年份'])
        const baseMinIndex = findColumnIndex(['base_min', '基数下限', '下限', 'min'])
        const baseMaxIndex = findColumnIndex(['base_max', '基数上限', '上限', 'max'])
        const rateIndex = findColumnIndex(['rate', '缴纳比例', '比例'])

        // 检查必需的列
        if (cityIndex === -1 || yearIndex === -1 || baseMinIndex === -1 ||
            baseMaxIndex === -1 || rateIndex === -1) {
          console.error('找不到必要的列', {
            cityIndex, yearIndex, baseMinIndex, baseMaxIndex, rateIndex,
            headers
          })
          reject(new Error('城市标准文件缺少必要的列，请确保包含：城市名称、年份、基数下限、基数上限、缴纳比例'))
          return
        }

        // 转换数据
        const cities: City[] = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[]
          if (row.length === 0 || !row[0]) continue // 跳过空行

          const city: City = {
            id: i, // 使用行号作为临时ID
            city_name: String(row[cityIndex] || ''),
            year: String(row[yearIndex] || ''),
            base_min: Number(row[baseMinIndex] || 0),
            base_max: Number(row[baseMaxIndex] || 0),
            rate: Number(row[rateIndex] || 0)
          }

          cities.push(city)
        }

        resolve(cities)
      } catch (error) {
        reject(new Error('解析城市标准文件失败：' + error))
      }
    }

    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsArrayBuffer(file)
  })
}

export function parseSalariesExcel(file: File): Promise<Salary[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = xlsx.read(data, { type: 'array' })
        const sheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[sheetName]

        const jsonData = xlsx.utils.sheet_to_json(worksheet, { header: 1 }) as any[]

        if (jsonData.length < 2) {
          reject(new Error('工资数据文件格式错误：没有数据'))
          return
        }

        // 获取表头并清理
        const headers = (jsonData[0] as string[]).map(h =>
          h ? h.trim().toLowerCase().replace(/\s+/g, '_') : ''
        )

        console.log('工资文件解析到的表头:', headers)
        console.log('工资文件原始表头:', jsonData[0])

        // 查找列索引（支持多种可能的列名）
        const findColumnIndex = (possibleNames: string[]) => {
          for (const name of possibleNames) {
            const index = headers.findIndex(h => h.includes(name))
            if (index !== -1) return index
          }
          return -1
        }

        const empIdIndex = findColumnIndex(['employee_id', '员工编号', '工号', '员工id'])
        const empNameIndex = findColumnIndex(['employee_name', '员工姓名', '姓名'])
        const monthIndex = findColumnIndex(['month', '月份', '年月'])
        const salaryIndex = findColumnIndex(['salary_amount', '工资金额', '工资', '金额'])

        // 检查必需的列
        if (empIdIndex === -1 || empNameIndex === -1 || monthIndex === -1 || salaryIndex === -1) {
          console.error('找不到必要的列', {
            empIdIndex, empNameIndex, monthIndex, salaryIndex,
            headers
          })
          reject(new Error('工资数据文件缺少必要的列，请确保包含：员工编号、员工姓名、年月、工资金额'))
          return
        }

        // 转换数据
        const salaries: Salary[] = []
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[]
          if (row.length === 0 || !row[0]) continue // 跳过空行

          const salary: Salary = {
            id: i, // 使用行号作为临时ID
            employee_id: String(row[empIdIndex] || ''),
            employee_name: String(row[empNameIndex] || ''),
            month: String(row[monthIndex] || ''),
            salary_amount: Number(row[salaryIndex] || 0)
          }

          salaries.push(salary)
        }

        resolve(salaries)
      } catch (error) {
        reject(new Error('解析工资数据文件失败：' + error))
      }
    }

    reader.onerror = () => reject(new Error('读取文件失败'))
    reader.readAsArrayBuffer(file)
  })
}