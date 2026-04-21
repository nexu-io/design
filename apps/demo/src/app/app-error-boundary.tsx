import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };

type State = { error: Error | null };

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Demo app error:", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            fontFamily: "system-ui, sans-serif",
            maxWidth: 720,
          }}
        >
          <h1 style={{ fontSize: 20, marginBottom: 12 }}>页面加载出错</h1>
          <p style={{ color: "#666", marginBottom: 16 }}>
            请打开开发者工具（Console）查看完整堆栈，或把下方错误信息发给开发者。
          </p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              background: "#f5f5f5",
              padding: 12,
              borderRadius: 8,
              fontSize: 13,
            }}
          >
            {this.state.error.message}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}
