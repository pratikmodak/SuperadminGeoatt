// superadmin-web/src/hooks/index.js

// ── useApi — generic data fetcher ─────────────────────────
import { useState, useEffect, useCallback, useRef } from 'react';

export const useApi = (fetchFn, deps = []) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const mountedRef = useRef(true);

  const run = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchFn();
      if (mountedRef.current) setData(result);
    } catch (err) {
      if (mountedRef.current) setError(err.message);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, deps);

  useEffect(() => {
    run();
    return () => { mountedRef.current = false; };
  }, [run]);

  return { data, loading, error, refetch: run };
};

// ── usePagination — page state ─────────────────────────────
export const usePagination = (pageSize = 20) => {
  const [page,    setPage]   = useState(1);
  const [total,   setTotal]  = useState(0);

  const totalPages = Math.ceil(total / pageSize);
  const offset     = (page - 1) * pageSize;

  return {
    page, setPage, total, setTotal,
    totalPages, offset, pageSize,
    canNext: page < totalPages,
    canPrev: page > 1,
    next: () => setPage(p => Math.min(p + 1, totalPages)),
    prev: () => setPage(p => Math.max(p - 1, 1)),
    reset: () => setPage(1),
  };
};

// ── useDebounce — delay fast input ────────────────────────
export const useDebounce = (value, delay = 300) => {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
};

// ── useLocalStorage — persist UI state ────────────────────
export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const set = useCallback((v) => {
    setValue(v);
    try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
  }, [key]);

  return [value, set];
};

// ── useSocket — web socket for superadmin panel ────────────
import { useEffect as useSocketEffect, useRef as useSocketRef } from 'react';

export const useWebSocket = (url, onMessage) => {
  const wsRef    = useSocketRef(null);
  const pingRef  = useSocketRef(null);

  useSocketEffect(() => {
    const token = localStorage.getItem('ga_token');
    if (!token || !url) return;

    const connect = () => {
      const ws = new WebSocket(`${url.replace('https', 'wss').replace('http', 'ws')}/socket.io/?EIO=4&transport=websocket`);
      wsRef.current = ws;

      ws.onopen = () => {
        // Socket.io handshake
        ws.send('40');
        // Keepalive ping every 20s (Render-safe)
        pingRef.current = setInterval(() => ws.send('3'), 20000);
      };

      ws.onmessage = (e) => {
        if (e.data.startsWith('42')) {
          try {
            const [event, data] = JSON.parse(e.data.slice(2));
            onMessage?.(event, data);
          } catch {}
        }
      };

      ws.onclose = () => {
        clearInterval(pingRef.current);
        // Reconnect after 3s
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      clearInterval(pingRef.current);
      wsRef.current?.close();
    };
  }, [url]);
};
