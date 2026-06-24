import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDashboardSocketTransport } from "./useDashboardSocketTransport";
import { makeDashboardPayload } from "../test/fixtures/dashboardPayload";

class MockWebSocket {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  static instances: MockWebSocket[] = [];

  readyState = MockWebSocket.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  url: string;

  constructor(url: string) {
    this.url = url;
    MockWebSocket.instances.push(this);
  }

  close() {
    this.readyState = MockWebSocket.CLOSING;
  }

  emitOpen() {
    this.readyState = MockWebSocket.OPEN;
    this.onopen?.(new Event("open"));
  }

  emitMessage(data: string) {
    this.onmessage?.({ data } as MessageEvent);
  }
}

describe("useDashboardSocketTransport", () => {
  beforeEach(() => {
    MockWebSocket.instances = [];
    vi.stubGlobal("WebSocket", MockWebSocket as unknown as typeof WebSocket);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("sets online status after socket open", () => {
    const { result } = renderHook(() =>
      useDashboardSocketTransport("ws://localhost:8080"),
    );

    const ws = MockWebSocket.instances[0];
    expect(ws).toBeDefined();

    act(() => {
      ws.emitOpen();
    });

    expect(result.current.connectionStatus).toBe("online");
  });

  it("stores payload on init message", () => {
    const payload = makeDashboardPayload();
    const { result } = renderHook(() =>
      useDashboardSocketTransport("ws://localhost:8080"),
    );

    const ws = MockWebSocket.instances[0];
    act(() => {
      ws.emitOpen();
      ws.emitMessage(JSON.stringify({ type: "init", data: payload }));
    });

    expect(result.current.data).not.toBeNull();
    expect(result.current.data?.snapshot.openCount).toBe(4);
    expect(result.current.lastErrorReason).toBeNull();
  });

  it("creates a new socket instance after manual retry", () => {
    const { result } = renderHook(() =>
      useDashboardSocketTransport("ws://localhost:8080"),
    );

    expect(MockWebSocket.instances).toHaveLength(1);

    act(() => {
      result.current.retryNow();
    });

    expect(MockWebSocket.instances).toHaveLength(2);
  });
});
