# React CRUD Lib

一个基于 React 的 CRUD 库，采用 monorepo 架构开发和管理。

## 项目结构

```
react-crud-lib/
├── packages/
│   ├── react-crud-kit/     # 核心 CRUD 库
│   └── playground/         # 测试和演示项目
├── package.json            # 根目录配置
├── pnpm-workspace.yaml     # pnpm workspace 配置
└── README.md
```

## 快速开始

### 安装依赖

```bash
pnpm install
```

### 开发模式

启动 playground 开发服务器：

```bash
pnpm dev
```

### 构建

构建 react-crud-kit 库：

```bash
pnpm build
```

实时编译 react-crud-kit 库：

```bash
pnpm dev:kit
```

构建所有包：

```bash
pnpm build:all
```

### 其他命令

```bash
# 运行所有包的 lint
pnpm lint

# 运行所有包的测试
pnpm test

# 清理所有构建产物
pnpm clean
```

## 包说明

### react-crud-kit

核心 CRUD 库，提供：
- CRUD 组件
- 表单处理
- 数据管理工具
- TypeScript 类型定义

### playground

用于测试和演示 react-crud-kit 功能的 React 应用。

## 发布

发布 react-crud-kit 到 npm：

```bash
cd packages/react-crud-kit
npm publish
```

## 技术栈

- **包管理**: pnpm workspace
- **构建工具**: Rollup (库), Vite (playground)
- **语言**: TypeScript
- **UI 框架**: React + Ant Design
- **开发工具**: ESLint

## 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request