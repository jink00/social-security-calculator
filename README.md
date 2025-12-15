# 五险一金计算器

一个基于 Next.js + Supabase 的 Web 应用，用于计算员工社保公积金费用。

## 功能特点

- 📊 Excel 文件上传解析
- 💼 支持多员工批量计算
- 🔍 结果搜索和分页
- 📥 Excel 结果导出
- 📱 响应式设计

## 技术栈

- **前端**: Next.js 14, React, TypeScript
- **样式**: Tailwind CSS
- **数据库**: Supabase
- **Excel 处理**: xlsx

## 快速开始

### 环境要求

- Node.js 18+
- npm 或 yarn

### 安装步骤

1. 克隆仓库
```bash
git clone https://github.com/jink00/social-security-calculator.git
cd social-security-calculator
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
创建 `.env.local` 文件，填���你的 Supabase 配置：
```
NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
```

4. 运行开发服务器
```bash
npm run dev
```

5. 访问 [http://localhost:3000](http://localhost:3000)

### Supabase 数据库设置

在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 创建城市标准表
CREATE TABLE cities (
  id INT PRIMARY KEY,
  city_name TEXT NOT NULL,
  year TEXT NOT NULL,
  base_min INT NOT NULL,
  base_max INT NOT NULL,
  rate FLOAT NOT NULL
);

-- 创建员工工资表
CREATE TABLE salaries (
  id INT PRIMARY KEY,
  employee_id TEXT NOT NULL,
  employee_name TEXT NOT NULL,
  month TEXT NOT NULL,
  salary_amount INT NOT NULL
);

-- 创建计算结果表
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  employee_name TEXT NOT NULL,
  avg_salary FLOAT NOT NULL,
  contribution_base FLOAT NOT NULL,
  company_fee FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 禁用 RLS（可选，根据安全需求调整）
ALTER TABLE cities DISABLE ROW LEVEL SECURITY;
ALTER TABLE salaries DISABLE ROW LEVEL SECURITY;
ALTER TABLE results DISABLE ROW LEVEL SECURITY;
```

## 使用说明

1. **准备数据文件**
   - `cities.xlsx`: 城市社保标准
   - `salaries.xlsx`: 员工工资数据

2. **上传数据**
   - 访问 /upload 页面
   - 分别上传两个 Excel 文件
   - 点击"执行计算"

3. **查看结果**
   - 访问 /results 页面
   - 搜索、分页查看结果
   - 导出为 Excel

## Excel 文件格式

### cities.xlsx
| city_name | year | base_min | base_max | rate  |
|-----------|------|----------|----------|-------|
| 佛山      | 2024 | 1900     | 31886    | 0.15  |

### salaries.xlsx
| employee_id | employee_name | month   | salary_amount |
|-------------|---------------|---------|---------------|
| E001        | 张三          | 202401  | 8000          |
| E002        | 李四          | 202401  | 12000         |

## 部署

### Vercel 部署（推荐）

1. 将代码推送到 GitHub
2. 访问 [vercel.com](https://vercel.com) 并使用 GitHub 账户登录
3. 点击 "New Project"
4. 选择你的仓库 `social-security-calculator`
5. 配置环境变量（与本地 `.env.local` 相同）
6. 点击 "Deploy"

## 许可证

MIT License

## 贡献

欢迎提交 Issue 和 Pull Request！