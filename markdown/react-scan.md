# react - scan 核心原理剖析

react - scan 是一个用于监听react重渲染的工具，其核心原理是巧妙伪装成 React DevTools，借此成功接入 React 的内部运行机制，从而精准获取 Fiber 节点关键信息，实现对组件更新状况的实时监控。

React DevTools 在网页的 window 对象上会挂载一个特殊的全局对象：`__REACT_DEVTOOLS_GLOBAL_HOOK__`。React 在自身运行期间，于某些关键生命周期节点，会调用这个对象上的指定方法，像在 commit 阶段就会调用 `onCommitFiberRoot` 方法，并向其传入当前更新的 FiberRoot 节点作为参数。

react - scan 则利用这一点，通过劫持该 hook 上的函数，例如对 `onCommitFiberRoot` 进行重写操作，从而顺利获取整个 React 应用的 Fiber 树根节点。获取根节点后，借助 Fiber 节点的 child 属性指向第一个子节点、sibling 属性指向下一个兄弟节点，就能递归遍历整棵 Fiber 树，进而拿到每一个组件对应的 Fiber 节点详细信息。

**如何判断组件是否发生更新？**

  * 对于非 Host 组件（即非原生 DOM 节点）：通过位运算判断其 flags 与 PerformedWork 相与的结果是否为 PerformedWork，以此确定该 Fiber 节点是否发生更新。
  * 对于 Host 组件（对应实际 DOM 节点）：
    * 若不存在 alternate 节点，表明是组件的首次渲染（因为 Fiber 采用双缓冲机制，存在当前树与上一次树之分）。
    * 若存在 alternate 节点，则对比当前与上一次的 memoizedProps（组件属性）、memoizedState（组件状态）、ref，判断组件是否更新。

**如何定位更新组件的 DOM 元素？**

一旦确定组件发生更新，可以从对应的 Fiber 节点向上查找最近的 Host 节点（即 Host Fiber），获取其关联的 DOM 元素，进而对 DOM 元素进行高亮或标记操作，方便进行调试或可视化展示。

**一些其他功能：**

  * 对比两棵 Fiber 树的 memoizedProps，能够精确知晓具体哪个 prop 发生了变化。
  * 判断是否因 Context 变化引发的组件更新：可通过 fiber.firstContext 获取组件订阅的第一个 Context，然后凭借其 next 属性依次遍历所有订阅的 Context 节点，查找更新源头。
  * 判断是否因为 Hook 更新导致组件更新：鉴于 Fiber 上的 memoizedState 存储着 hooks 链表，可据此分析是哪个 state 发生了变化。