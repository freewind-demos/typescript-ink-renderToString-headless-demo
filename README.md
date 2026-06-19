# Ink renderToString Headless Demo

## 简介

这个 Demo 演示 Ink 的 headless 用法：终端里不挂载原 Ink 组件，只显示 `renderToString` 生成的字符串。交互由 `useInput` 驱动，状态变化后再异步 snapshot。

## 快速开始

### 环境要求

- Node.js 20+
- pnpm 9+

### 安装

```bash
pnpm install
```

### 运行

```bash
pnpm start
```

## 注意事项

- `renderToString` 不能和 live `render()` 同一帧同步调用，否则会破坏 yoga wasm。
- `renderToString` 场景下 terminal hooks 都是 no-op，不能指望组件内部的 `useInput` / focus 逻辑生效。

## 教程

### 1. 为什么需要 headless

有些场景只需要 Ink 的布局结果，例如写日志、发消息、做 snapshot 测试。这时可以把 Ink 组件当“渲染引擎”，终端只展示 string。

### 2. 数据流

1. `useInput` 接收键盘，更新 `activeTabName`
2. `useEffect` 里 `setTimeout(0)` 延后调用 `renderToString`
3. 把返回的 string 按行拆成 `<Text>` 输出

### 3. 关键代码

```tsx
useEffect(() => {
  const id = setTimeout(() => {
    setToStringOutput(
      renderToString(<TabSnapshotPanel activeTabName={activeTabName} />),
    );
  }, 0);

  return () => clearTimeout(id);
}, [activeTabName]);
```

`TabSnapshotPanel` 是纯展示组件，专门给 `renderToString` 用。live 层只负责输入和把 snapshot 画出来。
