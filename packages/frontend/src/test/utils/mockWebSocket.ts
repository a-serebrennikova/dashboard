import { vi } from "vitest";

class MockWebSocketImpl {
  static CONNECTING = 0;
  static OPEN = 1;
  static CLOSING = 2;
  static CLOSED = 3;
  static instances: MockWebSocketImpl[] = [];

  readyState = MockWebSocketImpl.CONNECTING;
  onopen: ((event: Event) => void) | null = null;
  onmessage: ((event: MessageEvent) => void) | null = null;
  onclose: ((event: Event) => void) | null = null;
  onerror: ((event: Event) => void) | null = null;
  url: string;

  constructor(url: string) {
    this.url = url;
    MockWebSocketImpl.instances.push(this);
  }

  close() {
    this.readyState = MockWebSocketImpl.CLOSING;
  }

  emitOpen() {
    this.readyState = MockWebSocketImpl.OPEN;
    this.onopen?.(new Event("open"));
  }

  emitClose() {
    this.readyState = MockWebSocketImpl.CLOSED;
    this.onclose?.(new Event("close"));
  }

  emitMessage(data: string) {
    this.onmessage?.(new MessageEvent("message", { data }));
  }
}

export const mockWebSocket = {
  install() {
    MockWebSocketImpl.instances = [];
    vi.stubGlobal("WebSocket", MockWebSocketImpl);
  },
  get instances(): MockWebSocketImpl[] {
    return MockWebSocketImpl.instances;
  },
};
