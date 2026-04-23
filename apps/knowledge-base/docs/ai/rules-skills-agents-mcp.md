---
id: rules-skills-agents-mcp
title: 🧠 Rules、Skills、Agents、MCP 是什么：从通用 AI 工具体系到 Trae 前端落地
slug: rules-skills-agents-mcp
description: 深度解析 AI 工具链中的四大核心概念（约束层、能力层、执行层、连接层），以及它们如何在前端开发和 Trae IDE 中落地。
tags:
  - AI
  - Trae
  - MCP
  - Agent
  - 工具链
sidebar_position: 7
---

# Rules、Skills、Agents、MCP 是什么：从通用 AI 工具体系到 Trae 前端落地

很多人在开始系统化使用 AI IDE、AI Agent 或代码助手时，都会碰到四个高频词：

* Rules
* Skills
* Agents
* MCP

但这四个概念不应该只在某一个产品里理解。更准确的看法是：

> 它们代表了 AI 工具链里四种不同层次的能力：**约束层、能力层、执行层、连接层**。

其中，**MCP** 本身是一个开放标准，用来把 AI 应用连接到外部系统；**Agents** 是整个 agentic systems 领域的通用概念；**Skills** 也已经不只是某个单一产品里的按钮，而是越来越常见的“可复用能力封装”；只有 **Rules** 更接近产品层对“约束机制”的命名。Trae 则把这四层能力产品化成了自己的实现方式。

所以这篇文章不会只讲 “Trae 里的四个功能是什么”，而是按更合理的顺序来讲：

1. 它们在通用 AI 工具体系里分别代表什么
2. 它们彼此之间的边界和配合关系是什么
3. 在 Trae 里分别怎么落地
4. 前端团队怎么真正把这套东西用起来

---

## 一、先用一句话讲清四者分工

最容易记住的版本是：

> **Rules 决定怎么做，Skills 决定会做什么，Agents 决定谁来做，MCP 决定能调用什么外部能力。**

再展开一点：

* **Rules**：给模型设约束，统一行为和输出风格
* **Skills**：把一类任务经验沉淀成可复用能力
* **Agents**：让 AI 以某种角色去执行任务，并调度工具
* **MCP**：把外部工具、服务、数据源接进 AI 系统

这个分层很重要。因为很多团队用 AI 越用越乱，根源不是模型不够强，而是把“规范、流程、角色、工具”全混在了一起。Anthropic 在讲 agentic systems 时，也强调要先区分 **workflows** 和 **agents**，并尽量用简单、可组合的模式，而不是一上来堆复杂抽象。

---

## 二、Rules 是什么：约束模型行为的“规范层”

从通用角度看，Rules 可以理解成：

> **让 AI 在长期协作中遵守同一套工作约束。**

在 Trae 里，官方对 Rules 的定义很明确：它用来规范 AI 的行为，包括代码风格、语言与框架、交互方式等，使输出更符合预期。Trae 把 Rules 放在 `Rules & Skills` 这一入口下管理。

### Rules 最适合放什么

Rules 适合放那些**跨任务、跨对话、长期成立**的约束，例如：

* 默认技术栈
* 默认语言
* 代码风格
* 回复结构
* 是否优先最小改动
* 是否允许随意加依赖

以前端团队为例，下面这些就很适合 Rule：

* 默认是 Vue 3 + TypeScript + Vite
* 组件优先使用 `script setup`
* 修改代码前先分析原因，再给最小改动方案
* 尽量保持现有目录结构和命名风格
* 不要随意引入新依赖

### Rules 不适合放什么

Rules 不适合承载复杂流程。比如：

* “把 Figma 设计稿转成页面”
* “自动生成联调类型定义”
* “排查 bug 并给最小修复”
* “上线前做前端自检”

这些不是约束，而是**任务套路**。这类内容更适合做成 Skill。

### 一个前端通用 Rule 示例

```md
你正在协助一个 Vue 3 + TypeScript + Vite 项目开发。

请始终遵守以下约束：
1. 优先使用 script setup。
2. 保持与当前项目目录结构、命名风格、封装习惯一致。
3. 修改代码前，先分析原因，再给最小改动方案。
4. 不随意引入新依赖；如确需引入，请先说明原因与替代方案。
5. 输出代码时，优先给可直接落地的实现，不要只给伪代码。
6. 如果信息不足，先列出缺失上下文，不要强行猜测。
```

这类 Rule 的价值，不是“帮你完成一次任务”，而是让后续所有任务都更稳定。

---

## 三、Skills 是什么：可复用的“任务能力层”

从通用角度看，Skill 最容易理解成：

> **把一类任务的经验、步骤、资源和输出方式打包成可复用能力。**

Anthropic 的 Agent Skills 文档把 Skills 定义为 **modular capabilities**，每个 Skill 都可以打包 instructions、metadata，以及 scripts、templates 等可选资源；它们不是一次性 prompt，而是按需加载、可组合复用的能力。

Trae 的文档也很接近这个思路：Skills 通过 `SKILL.md` 定义和管理，一个 Skill 可以封装 instructions、scripts 和相关资源，并且支持 **Global** 与 **Project** 两类；官方 best practice 还特别强调，一个好 Skill 应该是**清晰、严谨、可执行**的指令文档，要明确 **When、How、Output**。

### Skill 和 Prompt 的差别

Skill 和普通 prompt 的差别在于：

* prompt 往往是一次性的
* Skill 是可复用的
* prompt 更像“临时请求”
* Skill 更像“沉淀后的 SOP”

Anthropic 官方也明确写到，Skills 和 conversation-level instructions 不同：它们是可复用、按需加载的资源，用来减少重复提供同样指导。

### Skill 最适合放什么

Skill 最适合放**高频、重复、输入输出相对稳定**的任务，比如前端里的：

* 接口联调准备
* Bug 排查与最小修复
* 组件重构建议
* PR Review
* 上线前自检
* Figma 转页面前置整理

### 一个好 Skill 的判断标准

一个 Skill 好不好，通常看三件事：

#### 1. 名字是不是像任务

差的名字：
* 前端增强助手
* 高级开发能力
* 全能工程师

好的名字：
* Vue 页面 Bug 排查
* 接口联调准备
* 前端 PR Review
* 上线前前端自检

#### 2. 描述有没有写清输入和输出

差的描述：
* 帮我更高质量开发前端

好的描述：
* 输入现有页面代码、报错现象和预期行为；输出问题原因、最小改动方案、关键修改代码和验证步骤

#### 3. 一个 Skill 只做一类事

不要把“写页面 + 联调 + 修 bug + 写测试 + 做 review”全塞进一个 Skill。
Skill 越单一，匹配越稳定，复用价值越高。Trae 的 best practice 也强调，Skill 要清晰可执行，而不是一个模糊的能力口号。

### 一个前端 Skill 示例

```md
---
name: vue-bug-fix-minimal
description: 输入 Vue 组件代码、报错现象和预期行为。输出问题原因、最小改动方案、关键代码和验证步骤。适用于已有页面 bug 排查，不适用于整页重写。
---

# Vue 页面 Bug 排查

## 工作目标
先定位原因，再给最小改动方案，不要先整体重写。

## 输出要求
1. 问题原因分析
2. 最小改动方案
3. 修改后的关键代码
4. 验证步骤

## 注意事项
- 优先保持现有结构
- 不引入无必要依赖
- 如果信息不足，先指出缺失上下文
```

---

## 四、Agents 是什么：可执行的“角色层”

在通用 AI 工程里，Agent 不是某个产品专属词。Anthropic 把 agentic systems 分成 **workflows** 和 **agents** 两类，并把 agents 描述为：由模型**动态决定自己的过程和工具使用方式**的系统，而不是只沿固定代码路径运行。

所以可以把 Agent 理解成：

> **一个带目标、带角色、带工具、能调度能力的执行主体。**

Trae 的实现非常直接：官方文档说明，你可以创建自定义 agents，并为它们配置 **prompts、MCP servers、built-in tools**，让它们协助完成特定任务。

### Agent 和 Skill 的区别

最容易混淆的是 Agent 和 Skill。

可以这样区分：

* **Skill**：是一套能力说明书
* **Agent**：是带着这套能力去干活的人

也就是说：

* Skill 解决的是“这类任务怎么做”
* Agent 解决的是“由谁来接这类任务”

### 什么时候该用 Agent

当你需要的是**长期固定的工作角色**时，就该用 Agent。比如：

* 页面开发 Agent
* 接口联调 Agent
* 排障 Agent
* 测试 Agent

如果你只是在一次任务里复用流程，用 Skill 就够了；如果你希望以后某类任务都由一个固定“身份”来处理，才有必要建 Agent。

### 一个高质量 Agent 的特点

一个 Agent 真正有用，通常满足三点：

#### 1. 职责单一

不要做“全能前端大神 Agent”。
更好的拆法是：
* 页面开发 Agent
* 排障 Agent
* 联调 Agent
* 测试 Agent

#### 2. 依赖清晰

Agent 本身只负责 orchestration，不要把所有细节流程都写进它的 prompt。
更好的做法是：**Agent 负责角色调度，Skill 负责具体 SOP**。

#### 3. 真正接了工具

没有工具的 Agent，本质上还是“更复杂的 prompt”。
真正高价值的 Agent，通常会同时带：
* Rules
* Skills
* MCP
* 内置工具

---

## 五、MCP 是什么：连接外部系统的“连接层”

MCP 不是 Trae 专属，也不是某一家产品私有协议。Model Context Protocol 官方文档把它定义为：

> **an open-source standard for connecting AI applications to external systems**。

它能把 AI 应用连接到数据源、工具和工作流，让模型不只是“会回答”，而是能访问外部信息并执行任务。官方甚至把它比作 AI 应用的 “USB-C port”。

同时，Anthropic 在讲 agentic systems 的基础能力时，也明确把 **retrieval、tools、memory** 看成 augmented LLM 的关键增强能力，并提到 MCP 是一种把第三方工具生态接进来的简单方式。

### MCP 到底解决什么问题

没有 MCP 时，AI 很多时候只能：
* 看文本
* 写建议
* 输出代码
* 给步骤

但有了 MCP，AI 可以真正访问外部世界，比如：
* 文件
* 数据库
* 日历
* 文档
* 设计稿
* 测试工具
* 内部服务

MCP 官方文档给的例子就包括连接 Google Calendar、Notion、数据库，以及让 Claude Code 依据 Figma 设计生成 web app。

### 前端为什么特别需要 MCP

前端开发链路天然依赖外部系统：
* 上游是设计稿
* 中间是接口、文档、组件库
* 下游是测试、回归、发布验证

如果没有 MCP，很多时候 AI 只能给“抽象建议”；
有了 MCP，AI 才可能直接接触这些真实工具。

---

## 六、四者的边界：最容易混淆的地方

把四者边界讲清楚，比背定义更重要。

### 1. Rules 不是 Skill

Rules 管的是长期约束。
Skill 管的是任务流程。

“统一使用 Vue 3 + TS + script setup” 是 Rule。
“根据接口文档生成 TS 类型和请求示例” 是 Skill。

### 2. Skill 不是 Agent

Skill 是说明书。
Agent 是执行角色。

“前端 PR Review” 是 Skill。
“前端代码评审 Agent” 是 Agent。

### 3. Agent 不是 MCP

Agent 是谁来做。
MCP 是它能连什么工具。

“测试 Agent” 是 Agent。
“Playwright server” 是 MCP。

### 4. MCP 不是 Rule 或 Skill 的替代品

MCP 只是把工具接进来。
它不会自动替你设计规范，也不会自动形成高质量流程。

真正稳定的系统通常是：

> **Rules 定边界，Skills 定 SOP，Agents 做调度，MCP 供外部能力。**

---

## 七、在 Trae 里，这四层分别怎么落地

现在再落到 Trae，就会很顺。

### 1. Rules 在 Trae 里的落地

Trae 官方把 Rules 放在 `Rules & Skills` 里，用于规定 AI 的行为，包括代码风格、语言与框架、交互方式等。

这意味着你可以在 Trae 里把团队默认协作方式沉淀下来，比如：
* 默认中文回复
* 默认 Vue 3 + TS
* 优先最小改动
* 不乱加依赖
* 输出代码时附带关键说明

### 2. Skills 在 Trae 里的落地

Trae 的 Skills 通过 `SKILL.md` 定义，一个 Skill 可以封装 instructions、scripts 和相关资源，并支持 **Global** 与 **Project**。官方 best practice 还建议 Skill 要写清 when/how/output。

这意味着你可以在 Trae 里把前端高频工作沉淀成 Skill，例如：
* 接口联调准备
* 页面 bug 排查
* PR review
* 上线前自检

### 3. Agents 在 Trae 里的落地

Trae 的 Agent 文档明确说明：你可以创建 custom agents，并为它们配置 prompts、MCP servers 和 built-in tools。

这意味着你可以在 Trae 里建：
* 页面开发 Agent
* 联调 Agent
* 排障 Agent
* 测试 Agent

### 4. MCP 在 Trae 里的落地

Trae 官方已经给了面向前端的两个非常典型的 MCP 教程：
* **Figma AI Bridge**：把 Figma 设计稿转成前端代码
* **Playwright**：实现自动化 Web 测试

这两个教程本身就说明了一件事：

> Trae 里的 MCP 不是抽象概念，而是可以直接接到前端工作流里的。

---

## 八、前端在 Trae 里怎么落地：一套最小可用方案

下面给一套非常适合前端团队的最小落地方案。核心目标不是一次配得很复杂，而是先让系统可用、可复用、可扩展。

### 第一步：先建一个前端通用 Rule

目标：统一默认行为。

建议内容：

```md
默认这是一个 Vue 3 + TypeScript + Vite 项目。

请始终遵守：
1. 组件优先使用 script setup。
2. 保持与现有项目命名和目录风格一致。
3. 先分析问题，再给最小改动方案。
4. 不随意引入新依赖。
5. 输出结果优先给可直接落地代码。
6. 信息不足时先指出缺失上下文。
```

这一步做完后，你后续所有对话的稳定性都会明显提高。

---

### 第二步：建 3 个最有价值的 Skill

#### Skill 1：接口联调准备
适合输入：接口文档、页面展示字段、当前请求封装方式
输出：请求参数说明、响应结构说明、TypeScript 类型、调用示例、风险提示

#### Skill 2：Vue 页面 Bug 排查
适合输入：现有组件代码、报错现象、预期行为
输出：原因分析、最小改动方案、关键修改代码、验证步骤

#### Skill 3：前端 PR Review
适合输入：diff 或提交代码、项目规范
输出：必须修改项、建议优化项、潜在风险、优点总结

这 3 个 Skill 的价值非常高，因为它们都是前端高频、重复、结构清晰的任务。

---

### 第三步：建两个 Agent

#### Agent A：前端开发 Agent
职责：生成页面骨架、写表单/列表/详情页、协助接口联调准备
挂载建议：前端通用 Rule、接口联调 Skill、必要的内置工具、必要时挂 Figma MCP

#### Agent B：前端排障 Agent
职责：排查白屏、布局异常、样式不生效、状态错乱，提供最小修复建议
挂载建议：前端通用 Rule、Bug 排查 Skill、Playwright MCP 或相关测试能力

这样做比做一个“万能前端 Agent”更实用，因为角色职责清晰，模型更容易稳定发挥。

---

### 第四步：接两个最值得优先接的 MCP

#### 1. Figma MCP
Trae 官方教程明确是“Turn Figma designs into front-end code”。这对前端最直接的价值是：
* 设计稿信息提取
* 页面结构还原
* 样式和布局生成
* 设计到代码的转换提速

#### 2. Playwright MCP
Trae 官方教程明确是“Implement automated web testing”。这对前端的价值是：
* 自动化回归
* 关键流程检查
* 表单和路由验证
* 上线前自检辅助

如果你的团队只打算先接两个 MCP，这两个通常是前端优先级最高的。

---

## 九、怎么用好：不是把功能开全，而是把分层做好

很多团队的问题不是“不会开功能”，而是“不会设计分层”。

真正高质量的用法，通常遵循下面这套原则。

### 1. 把稳定共识放 Rules
凡是长期成立、跨任务通用的，都放 Rule：技术栈、语言、风格、输出习惯、工程边界。

### 2. 把高频 SOP 放 Skills
凡是高频重复任务，都尽量沉淀成 Skill：联调、排障、review、自检、文档整理。

### 3. 把角色职责放 Agents
当你发现一类任务会被反复交给同一种“工作身份”时，再建 Agent。

### 4. 把外部依赖放 MCP
设计稿、测试、内部工具、文档系统，不要靠 prompt 假装理解，能接就接。

### 5. 从最小组合开始
最推荐的起步组合是：
* 1 个前端 Rule
* 3 个高频 Skill
* 2 个 Agent
* 2 个核心 MCP

先跑通，再扩展。Anthropic 在 agentic systems 的经验总结里也强调：先用简单、可组合的模式，而不是一开始就上复杂框架。

---

## 十、常见误区

### 误区 1：把所有内容都写进一个 Rule
结果就是：Rule 越来越长，任务边界越来越模糊，模型很难稳定执行。

### 误区 2：把 Skill 写成口号
比如“高级前端能力增强”。这种 Skill 基本不会稳定好用，因为没有明确输入、流程和输出。

### 误区 3：一上来就做全能 Agent
这会让 Agent 变成一个巨大 prompt 包。更好的做法是：先拆角色，再挂 Skill。

### 误区 4：不接 MCP，却希望 AI 真正干活
没有 MCP，很多时候 AI 只能“建议”；有了 MCP，它才可能“访问并执行”。

### 误区 5：把 Trae 当成唯一语境
如果只从某个 IDE 的按钮理解这些概念，就很难把经验迁移到别的 AI 工具链。真正高质量的知识库写法，应该先讲通用分层，再讲具体产品实现。

---

## 十一、结语：先建立体系，再选择工具

如果只记一句话，我建议记这句：

> **Rules、Skills、Agents、MCP 不是四个并列按钮，而是四层不同职责的系统设计。**

它们分别对应：
* **Rules**：长期约束
* **Skills**：可复用 SOP
* **Agents**：角色化执行
* **MCP**：外部能力接入

Trae 的价值，不是“发明了这四个词”，而是把这四层能力在 IDE 里产品化了：Rules 和 Skills 放在统一配置里，Agents 负责角色化协作，MCP 把 Figma、Playwright 这类外部能力真正接进前端工作流。

所以更成熟的理解方式不是：
> “Trae 有 Rules、Skills、Agents、MCP 四个功能。”

而是：
> **“在通用 AI 工具体系里，规范、能力、角色、工具连接是四层不同问题；Trae 只是把这四层在前端开发场景中落地得比较完整。”**