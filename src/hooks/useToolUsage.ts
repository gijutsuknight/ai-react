import { useEffect, useMemo, useState } from 'react';
import { Tool } from '../types/Tool';

const STORAGE_KEY = 'tool-usage';

const INITIAL_TOOLS: Omit<Tool, 'usageCount'>[] = [
  {
    id: 'camera-tool',
    name: 'Camera Tool',
    description:
      'Access your webcam or phone camera to capture photos or short videos for testing and upload.',
  },
  {
    id: 'api-tester',
    name: 'API Tester (Placeholder)',
    description:
      'Placeholder for an API testing tool. Replace this with your real API testing module.',
  },
  {
    id: 'data-generator',
    name: 'Data Generator (Placeholder)',
    description:
      'Placeholder for a data generation tool. Use this entry for synthetic test data utilities.',
  },
  {
    id: 'mock-auth',
    name: 'Mock Auth (Placeholder)',
    description:
      'Placeholder for an authentication simulation tool. Ideal for testing auth-related flows.',
  },
  {
    id: 'log-viewer',
    name: 'Log Viewer (Placeholder)',
    description:
      'Placeholder for a log inspection tool. Use this for debugging logs and events.',
  },
  {
    id: 'performance-profiler',
    name: 'Performance Profiler (Placeholder)',
    description:
      'Placeholder for a performance profiling tool. Hook in metrics and performance dashboards here.',
  },
];

type StoredUsage = Record<string, number>;

function loadUsageFromStorage(): StoredUsage {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredUsage;
  } catch {
    return {};
  }
}

function saveUsageToStorage(usage: StoredUsage) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch {
    // Swallow storage errors; app should continue to function without persistence.
  }
}

export interface UseToolUsageResult {
  tools: Tool[];
  incrementUsage: (toolId: string) => void;
}

export function useToolUsage(): UseToolUsageResult {
  const [usage, setUsage] = useState<StoredUsage>({});

  useEffect(() => {
    setUsage(loadUsageFromStorage());
  }, []);

  const tools: Tool[] = useMemo(() => {
    const withCounts: Tool[] = INITIAL_TOOLS.map((tool) => ({
      ...tool,
      usageCount: usage[tool.id] ?? 0,
    }));

    // Sort descending by usageCount so most frequently used tools appear first.
    return withCounts.sort((a, b) => b.usageCount - a.usageCount);
  }, [usage]);

  const incrementUsage = (toolId: string) => {
    setUsage((current) => {
      const next: StoredUsage = {
        ...current,
        [toolId]: (current[toolId] ?? 0) + 1,
      };
      saveUsageToStorage(next);
      return next;
    });
  };

  return { tools, incrementUsage };
}

