import { renderHook, act } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useDashboardSocketTransport } from "../../contexts/hooks/useDashboardSocketTransport";
import { makeDashboardPayload } from "../utils/dashboardPayload";
import { mockWebSocket } from "../utils/mockWebSocket";

describe("useDashboardSocketTransport", () => {
  beforeEach(() => {
    mockWebSocket.install();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("sets online status after socket open", () => {
    const { result } = renderHook(() =>
      useDashboardSocketTransport("ws://localhost:8080"),
    );

    const ws = mockWebSocket.instances[0];
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

    const ws = mockWebSocket.instances[0];
    act(() => {
      ws.emitOpen();
      ws.emitMessage(JSON.stringify({ type: "init", data: payload }));
    });

    expect(result.current.data).not.toBeNull();
    expect(result.current.data?.incidents).toHaveLength(4);
    expect(result.current.lastErrorReason).toBeNull();
  });

  it("creates a new socket instance after manual retry", () => {
    const { result } = renderHook(() =>
      useDashboardSocketTransport("ws://localhost:8080"),
    );

    expect(mockWebSocket.instances).toHaveLength(1);

    act(() => {
      result.current.retryNow();
    });

    expect(mockWebSocket.instances).toHaveLength(2);
  });

  it("marks initial payload timeout when no message arrives", () => {
    vi.useFakeTimers();

    const { result } = renderHook(() =>
      useDashboardSocketTransport("ws://localhost:8080"),
    );

    const ws = mockWebSocket.instances[0];
    act(() => {
      ws.emitOpen();
      vi.advanceTimersByTime(30_001);
    });

    expect(result.current.isInitialDataTimedOut).toBe(true);
    expect(result.current.lastErrorReason).toBe("initial_payload_timeout");
  });

  it("switches to reconnecting on unexpected close", () => {
    const { result } = renderHook(() =>
      useDashboardSocketTransport("ws://localhost:8080"),
    );

    const ws = mockWebSocket.instances[0];
    act(() => {
      ws.emitOpen();
      ws.emitClose();
    });

    expect(result.current.connectionStatus).toBe("reconnecting");
    expect(result.current.lastErrorReason).toBe("connection_lost");
  });
});
