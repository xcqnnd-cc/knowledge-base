---
id: monorepo-pnpm-turbo-solution
title: 🧩 MonoRepo + pnpm + Turbo：一套高质量、可扩展的工程化方案
slug: monorepo-pnpm-turbo-solution
description: 探讨如何通过 pnpm 和 Turborepo 构建高质量的前端 Monorepo 架构，明确两者的分工与边界。
tags:
  - Monorepo
  - pnpm
  - Turborepo
  - 工程化
  - 架构设计
sidebar_position: 8
---

# MonoRepo + pnpm + Turbo：一套高质量、可扩展的工程化方案

如果你的团队已经开始同时维护多个应用、多个共享包，或者已经遇到这些问题：

* 多个项目依赖版本不一致
* 共享组件和工具函数复用成本高
* 构建、测试、Lint 越来越慢
* CI 每次都全量跑，时间和成本都很高
* 应用部署时很难只裁出目标项目所需的依赖

那么，**Monorepo + pnpm + Turborepo** 往往是一套非常稳的工程底座。pnpm 原生支持 workspace，支持 `workspace:` 协议、过滤执行和递归执行；Turborepo 则负责任务编排、并行执行、缓存和远程缓存，两者职责并不冲突，而是天然互补。

这篇文章的核心观点很简单：

> **pnpm 管“包”和“依赖”，Turbo 管“任务”和“缓存”。**

这是我更推荐的高质量方案，而不是把所有问题都压给一个工具。pnpm 负责 workspace、锁文件、内部包链接、部署裁剪；Turbo 负责根据仓库中的包关系调度任务，并对结果进行本地或远程缓存。

---

## 一、先说结论：推荐的分层方案

我更推荐把方案拆成四层：

### 1. 仓库与依赖层

* `pnpm-workspace.yaml`
* `workspace:` 协议
* `catalog:` / `catalogs`
* `pnpm --filter`
* `pnpm -r`

### 2. 类型与构建边界层

* TypeScript Project References
* 根配置抽离
* 应用和共享包的边界清晰化

### 3. 任务编排与性能层

* `turbo run build/lint/test/dev`
* `turbo.json`
* outputs 声明
* 本地缓存
* Remote Caching

### 4. 发布与交付层

* Changesets
* `pnpm publish -r`
* `pnpm deploy`
* Docker 多阶段构建

pnpm 的 workspace 是 monorepo 的底座；TypeScript Project References 适合把大型 TS 程序拆成小项目并启用 `tsc --build`；Turborepo 的职责是并行化和缓存任务；Changesets 则专门面向 monorepo 的多包版本管理。

---

## 二、为什么是 pnpm + Turbo，而不是只用其中一个

只用 pnpm，可以把 monorepo 搭起来，而且能很好地管理包、依赖和 workspace 内部链接。pnpm 要求根目录存在 `pnpm-workspace.yaml`，并内建支持 monorepo。

只用 Turbo，也不够。因为 Turbo 不是包管理器，它依赖你已有的 workspace 和 `package.json` 依赖图来理解内部包关系，再在这个基础上优化任务执行。Turborepo 官方明确说明它会根据 Internal Packages 的依赖关系建立 package graph，并据此优化仓库工作流。

所以更合理的答案不是二选一，而是：

> **pnpm 负责“依赖正确”，Turbo 负责“执行高效”。**

这也是为什么在现有 monorepo 上接入 Turbo 的官方流程里，前提之一就是你已经有 package manager workspaces，然后再添加 `turbo.json` 并用 `turbo run` 执行任务。

---

## 三、什么时候值得上这套方案

这套方案特别适合下面几类团队和仓库：

* 一个仓库里有多个前端应用，比如 `admin`、`web`、`docs`
* 同时维护多个共享包，比如 `ui`、`utils`、`eslint-config`
* 希望统一 TypeScript、Lint、测试和构建规范
* 仓库越来越大，本地构建和 CI 已经开始变慢
* 希望只部署某个应用，而不是把整个 monorepo 都塞进产物里

pnpm 的 workspace、过滤执行、递归执行和 deploy，本身就是为多包仓库设计的；Turbo 则强调用任务缓存和并行化优化本地与 CI 的工作流。

如果你的仓库还很小，只有 1 个 app、几乎没有共享包，那其实不一定要上全套。Monorepo 不是默认答案，而是当“共享、统一、协作、提效”开始变成真实需求时，才值得上的工程方案。这个判断更多是工程决策，不是工具本身强推的前提。

---

## 四、推荐的目录结构

下面是一套比较稳的前端 / Node 混合 monorepo 结构：

```text
.
├─ apps/
│  ├─ admin/
│  ├─ web/
│  └─ api/
├─ packages/
│  ├─ ui/
│  ├─ utils/
│  ├─ eslint-config/
│  ├─ tsconfig/
│  └─ shared/
├─ tooling/
│  ├─ scripts/
│  └─ generators/
├─ .changeset/
├─ package.json
├─ pnpm-workspace.yaml
├─ pnpm-lock.yaml
├─ tsconfig.base.json
└─ turbo.json
```

这种结构的关键不在于“长得标准”，而在于职责边界很清楚：`apps` 放可部署应用，`packages` 放共享包和配置包，`tooling` 放工具脚本。pnpm workspace 只要求你用 `pnpm-workspace.yaml` 声明工作区范围，但从工程实践看，把可部署应用和可复用包明确拆开，会让后面的构建、缓存和部署都更稳定。

---

## 五、先把 pnpm workspace 搭稳

### `pnpm-workspace.yaml`

```yaml
packages:
  - apps/*
  - packages/*
  - tooling/*

catalog:
  typescript: ^5.8.0
  eslint: ^9.0.0
  vite: ^7.0.0
```

pnpm 官方要求 monorepo 根目录必须有 `pnpm-workspace.yaml`。此外，pnpm 提供了 catalogs，用来在 workspace 里统一维护依赖版本，然后在各包中通过 `catalog:` 协议引用，减少重复声明和版本漂移。

### 根 `package.json`

```json
{
  "name": "my-monorepo",
  "private": true,
  "packageManager": "pnpm@10",
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck",
    "changeset": "changeset",
    "version-packages": "changeset version"
  },
  "devDependencies": {
    "@changesets/cli": "^2.0.0",
    "turbo": "^2.0.0",
    "typescript": "catalog:"
  }
}
```

这里最重要的点有两个：一是根脚本统一收口，二是把 `turbo run ...` 放在根部，而不是散落在各个包里。Turborepo 官方就是这样推荐接入现有 monorepo 的。

---

## 六、内部依赖：统一使用 `workspace:`

这是 pnpm monorepo 非常关键的一条实践。

### 推荐写法

```json
{
  "dependencies": {
    "@repo/utils": "workspace:*",
    "@repo/ui": "workspace:*"
  }
}
```

pnpm 官方明确说明：如果你只写普通 semver range，在某些配置下可能会出现“本地有匹配版本就链接，否则从 registry 安装”的情况；而 `workspace:` 协议会强制只解析到本地 workspace 包。发布时，pnpm 又会把 `workspace:` 自动转换为普通 semver 范围。

这条约定的价值很大：

> **开发阶段保证“内部依赖一定走本地”，发布阶段保证“外部消费者仍能正常安装”。**

这几乎是高质量 pnpm monorepo 最值得坚持的约束之一。

---

## 七、TypeScript：一定要配 Project References

如果你的 monorepo 里有多个 TypeScript 包，不要只靠一个巨大的 `tsconfig.json` 硬顶。

TypeScript 官方文档明确指出，Project References 可以把 TS 程序拆成更小的部分，从而改善构建时间、加强逻辑隔离，并配合 `tsc --build` 获得更快的构建模式。

### 根 `tsconfig.base.json`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "declaration": true,
    "composite": true,
    "skipLibCheck": true
  }
}
```

### `packages/utils/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "include": ["src"]
}
```

### `packages/ui/tsconfig.json`

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist"
  },
  "references": [{ "path": "../utils" }],
  "include": ["src"]
}
```

### 根脚本

```json
{
  "scripts": {
    "typecheck:tsc": "tsc -b"
  }
}
```

这里的重点不是“共享一份 TS 配置”，而是：

* 根里放公共编译选项
* 每个包有自己的 `tsconfig.json`
* 包之间用 `references`
* 根用 `tsc -b` 做增量构建

这套模式和 monorepo 的包边界是天然一致的。

---

## 八、Turbo：任务编排、缓存和 CI 提速层

当 pnpm 已经把 workspace 打稳之后，Turbo 的价值才会真正体现出来。

Turborepo 官方文档强调三件事：

* 它会自动并行化任务
* 它会缓存任务结果
* 任务在 `turbo.json` 里注册后，可以统一在本地和 CI 中执行。

### 一个最小可用的 `turbo.json`

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "typecheck": {
      "dependsOn": ["^typecheck"]
    },
    "lint": {},
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false
    }
  }
}
```

这个配置里最重要的是两点：

1. `dependsOn: ["^build"]` 表示当前包的 build 依赖上游依赖包的 build，这让 Turbo 能沿着内部依赖图自动排序。Turbo 官方说明它会根据 `package.json` 的内部依赖关系建立 Package Graph。
2. `outputs` 用来声明任务产物。Turbo 的缓存机制明确依赖 `outputs` 来恢复文件；如果不声明输出，很多任务的文件产物就不会被缓存。

### 根脚本统一改成 `turbo run`

```json
{
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "typecheck": "turbo run typecheck"
  }
}
```

这里不是让 Turbo 替代 pnpm，而是让它接管“任务运行入口”。pnpm 继续负责安装和依赖，Turbo 负责跑任务图。

---

## 九、Turbo 到底解决了什么问题

如果只用 pnpm 的 `-r`，你能做到递归执行，但做不到真正意义上的高效缓存和任务图优化。

Turbo 补上的，是这几件事：

### 1. 并行化

它会自动并行执行可以并行的任务。

### 2. 缓存

当任务命中缓存时，Turbo 会恢复任务输出，而不是重复构建。

### 3. 远程缓存

如果配置了 Remote Caching，缓存不只存在本地，还能在团队成员和 CI 之间共享。

### 4. 基于依赖图的执行顺序

Turbo 会根据 internal packages 的关系构建 package graph，这让共享包的改动和应用的增量构建关系更清晰。

所以对于中大型前端 monorepo，Turbo 真正的价值不是“能跑命令”，而是：

> **在不改变你包结构的前提下，把本地开发和 CI 的执行成本明显压下去。**

---

## 十、版本管理与发布：建议直接上 Changesets

如果你的 monorepo 不只是本地复用包，而是真的要发布内部包或公共包，直接上 Changesets 会更稳。

Changesets 官方文档把它定义为“面向 monorepo 的多包版本管理工具”，支持协调多个包的版本变更，并自动处理包之间的依赖更新。

### 初始化

```bash
pnpm add -Dw @changesets/cli
pnpm changeset init
```

### 日常流程

```bash
pnpm changeset
pnpm changeset version
pnpm install
pnpm publish -r
```

Changesets 文档说明了 `changeset version` 这一发布前步骤；pnpm 也支持递归发布。对于多包仓库，这比手工改版本可靠得多。

---

## 十一、部署：优先使用 `pnpm deploy`

monorepo 部署里最烦的一件事是：

> 我只想部署一个 app，但它依赖的内部包也必须正确带上。

这正是 `pnpm deploy` 的价值所在。pnpm 的 workspace 文档把 `deploy` 作为 monorepo 能力的一部分；它适合把目标包及其 workspace 依赖一起裁成独立可部署目录。

### 示例

```bash
pnpm --filter @repo/admin --prod deploy ./deploy/admin
```

这类命令非常适合：

* 单应用部署
* Docker 多阶段构建
* 减少镜像体积
* 从 monorepo 中裁出目标应用产物

从工程角度看，**pnpm 继续负责交付裁剪**，而不是把这件事也交给 Turbo，这就是职责清晰带来的好处。

---

## 十二、推荐的命令约定

高质量 monorepo 不只是目录好看，更重要的是命令心智统一。

### 全仓任务

```bash
pnpm install
turbo run build
turbo run lint
turbo run test
turbo run typecheck
```

### 局部任务

```bash
pnpm --filter @repo/admin dev
pnpm --filter @repo/ui add clsx
turbo run build --filter=@repo/admin
```

pnpm 的 `--filter` 用于按包选择工作区子集；Turbo 也支持按过滤范围执行任务。前者更适合“包操作”，后者更适合“任务操作”。这就是为什么我一直强调两者不是竞争关系，而是分工关系。

---

## 十三、常见坑与规避建议

### 1. 内部依赖不用 `workspace:`

后果是本地包和 registry 包可能混淆。
规避方法：内部包统一 `workspace:*` 或 `workspace:^`。

### 2. 所有包共享一个超大 `tsconfig`

后果是构建边界模糊，类型问题难排查。
规避方法：根公共配置 + 子包独立 tsconfig + Project References。

### 3. 一上来就把 Turbo 用得过重

后果是仓库复杂度上升，团队理解成本变高。
规避方法：先把 pnpm workspace 打稳，再让 Turbo 只接管任务调度和缓存。Turbo 官方接入现有 monorepo 的流程本身也是渐进式的。

### 4. 忘记声明 `outputs`

后果是明明用了 Turbo，却没真正吃到构建缓存。
规避方法：为 `build` 等产生产物的任务明确写 `outputs`。

### 5. 发布全靠手工改版本

后果是多包版本关系容易失控。
规避方法：直接用 Changesets。

---

## 十四、我更推荐的最终组合

如果让我给一个偏“生产可用”的答案，而不是“工具最多”的答案，我会推荐下面这套：

### 小到中型团队

* pnpm workspace
* `workspace:` 协议
* catalogs
* TypeScript Project References

### 中到大型团队

* 在上面基础上加 Turbo

### 涉及多包发布

* 再加 Changesets

### 涉及单应用部署

* 用 `pnpm deploy`

也就是：

> **Monorepo 的底座用 pnpm，类型边界用 TypeScript，任务效率用 Turbo，版本发布用 Changesets，部署裁剪用 pnpm deploy。**

这套分层比“只谈 monorepo 理想模型”更实用，也更适合长期维护。

---

## 十五、结语

Monorepo + pnpm + Turbo 的真正价值，不在于“把很多代码放进一个仓库”，而在于它能把这些事情统一到一套工程体系里：

* 依赖管理
* 共享代码
* 类型边界
* 任务编排
* 构建缓存
* 版本发布
* 单应用部署

如果你只是想要一个能跑的 monorepo，pnpm workspace 就足够开始。
但如果你想要的是一套**高质量解决方案**，那我更推荐你按这条路径来做：

**pnpm workspace → `workspace:` → catalogs → TS Project References → Turbo → Changesets → `pnpm deploy`。**

如果你要，我下一步可以直接给你一套 **“前端项目可直接落地的 monorepo + pnpm + turbo 模板”**，包括目录结构、配置文件、CI 示例和 Docker 方案。