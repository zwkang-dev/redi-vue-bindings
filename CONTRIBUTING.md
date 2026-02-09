# 贡献指南

感谢你对 `@zwkang-dev/redi-vue-binding` 的关注！我们欢迎任何形式的贡献。

## 环境要求

- **Node.js** >= 20.x
- **pnpm** 10.29.2（项目使用 `packageManager` 字段锁定版本）

## 快速开始

### 1. Fork 并克隆仓库

```bash
git clone https://github.com/<your-username>/redi-vue-bindings.git
cd redi-vue-bindings
```

### 2. 安装依赖

```bash
# 如果没有安装 pnpm，先安装
npm install -g pnpm@10.29.2

# 安装项目依赖
pnpm install
```

### 3. 开发模式

```bash
# 启动监听模式（自动重新构建）
pnpm dev
```

### 4. 运行 example 项目

```bash
cd example
pnpm install
pnpm dev
```

## 常用命令

| 命令 | 描述 |
|------|------|
| `pnpm dev` | 开发模式（监听文件变化） |
| `pnpm build` | 构建生产版本 |
| `pnpm test` | 运行测试 |
| `pnpm typecheck` | TypeScript 类型检查 |
| `pnpm lint:fix` | 代码格式化和 lint 修复 |

## 项目结构

```
├── src/                 # 源代码
│   ├── index.ts         # 入口文件
│   ├── component.tsx    # Vue 组件
│   ├── hooks.tsx        # Vue Hooks
│   ├── context.tsx      # RediContext
│   └── defineHook.ts    # Hook 依赖工具
├── test/                # 测试文件
├── example/             # 示例项目
└── dist/                # 构建产物
```

## 提交 Pull Request

### 1. 创建分支

```bash
git checkout -b feat/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 2. 开发并测试

```bash
# 开发
pnpm dev

# 确保测试通过
pnpm test

# 确保类型检查通过
pnpm typecheck

# 确保代码格式正确
pnpm lint:fix
```

### 3. 提交代码

我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```bash
# 新功能
git commit -m "feat: add new feature description"

# Bug 修复
git commit -m "fix: fix bug description"

# 文档
git commit -m "docs: update documentation"

# 重构
git commit -m "refactor: refactor code description"

# 测试
git commit -m "test: add tests for feature"

# 构建/工具链
git commit -m "chore: update dependencies"
```

### 4. 推送并创建 PR

```bash
git push origin feat/your-feature-name
```

然后在 GitHub 上创建 Pull Request，填写：

- **标题**：简洁描述改动内容
- **描述**：详细说明改动原因、实现方式、测试情况

## 代码规范

- 使用 TypeScript 编写代码
- 遵循 [@antfu/eslint-config](https://github.com/antfu/eslint-config) 规范
- 新功能需要添加对应的测试用例
- 导出的 API 需要添加 JSDoc 注释

## 测试

```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm vitest

# 查看覆盖率
pnpm vitest --coverage
```

## 问题反馈

如果你发现了 Bug 或有新功能建议，请在 [Issues](https://github.com/zwkang-dev/redi-vue-bindings/issues) 中提交。

---

再次感谢你的贡献！
