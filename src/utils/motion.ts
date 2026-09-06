// ==========================================
// prefers-reduced-motion 工具（无障碍）
// 尊重用户系统级「减少动态效果」偏好：
// 为 true 时，各组件跳过入场/视差/循环动画，
// 内容保持静态可见（Hero 依赖 _hero.scss 中
// 的 reduced-motion 覆盖强制显示）。
// ==========================================

export const REDUCED_MOTION: boolean =
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches
