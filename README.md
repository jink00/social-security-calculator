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
   git clone https://github.com/你的用户名/social-security-calculator.git
   cd social-security-calculator
   ```

2. 安装依赖
   ```bash
   npm install
   ```

3. 配置环境变量
   - 复制 `.env.local.example` 为 `.env.local`
   - 填入你的 Supabase 配置：
   ```
   NEXT_PUBLIC_SUPABASE_URL=你的Supabase项目URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=你的Supabase匿名密钥
   ```

4. 运行开发服务器
   ```bash
   npm run dev
   ```

5. 访问 [http://localhost:3000](http://localhost:3000)

## 许可证

MIT License
