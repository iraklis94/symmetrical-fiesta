import React from 'react';
import { PerformanceObserver, PerformanceEntry } from 'react-native';

interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private observers: Map<string, (metric: PerformanceMetric) => void> = new Map();
  private isEnabled = __DEV__;

  constructor() {
    if (this.isEnabled) {
      this.setupPerformanceObserver();
    }
  }

  private setupPerformanceObserver() {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.recordMetric(entry.name, entry.duration, {
            entryType: entry.entryType,
            startTime: entry.startTime,
          });
        });
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });
    } catch (error) {
      console.warn('PerformanceObserver not supported:', error);
    }
  }

  startTimer(name: string): () => void {
    if (!this.isEnabled) return () => {};

    const startTime = performance.now();
    return () => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
    };
  }

  recordMetric(name: string, value: number, metadata?: Record<string, any>) {
    if (!this.isEnabled) return;

    const metric: PerformanceMetric = {
      name,
      value,
      timestamp: Date.now(),
      metadata,
    };

    this.metrics.push(metric);
    this.notifyObservers(metric);

    // Log in development
    if (__DEV__) {
      console.log(`Performance: ${name} = ${value.toFixed(2)}ms`, metadata);
    }
  }

  measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    return fn().finally(() => {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
    });
  }

  measureSync<T>(name: string, fn: () => T): T {
    if (!this.isEnabled) return fn();

    const startTime = performance.now();
    try {
      return fn();
    } finally {
      const duration = performance.now() - startTime;
      this.recordMetric(name, duration);
    }
  }

  addObserver(name: string, callback: (metric: PerformanceMetric) => void) {
    this.observers.set(name, callback);
  }

  removeObserver(name: string) {
    this.observers.delete(name);
  }

  private notifyObservers(metric: PerformanceMetric) {
    this.observers.forEach((callback) => {
      try {
        callback(metric);
      } catch (error) {
        console.error('Error in performance observer:', error);
      }
    });
  }

  getMetrics(name?: string): PerformanceMetric[] {
    if (name) {
      return this.metrics.filter(m => m.name === name);
    }
    return [...this.metrics];
  }

  getAverageMetric(name: string): number {
    const metrics = this.getMetrics(name);
    if (metrics.length === 0) return 0;
    
    const sum = metrics.reduce((acc, m) => acc + m.value, 0);
    return sum / metrics.length;
  }

  clearMetrics() {
    this.metrics = [];
  }

  enable() {
    this.isEnabled = true;
  }

  disable() {
    this.isEnabled = false;
  }

  isMonitoringEnabled(): boolean {
    return this.isEnabled;
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Convenience functions
export const measureAsync = <T>(name: string, fn: () => Promise<T>): Promise<T> => {
  return performanceMonitor.measureAsync(name, fn);
};

export const measureSync = <T>(name: string, fn: () => T): T => {
  return performanceMonitor.measureSync(name, fn);
};

export const startTimer = (name: string): (() => void) => {
  return performanceMonitor.startTimer(name);
};

// React Hook for measuring component render time
export const usePerformanceMeasure = (componentName: string) => {
  const startTime = React.useRef(performance.now());
  
  React.useEffect(() => {
    const duration = performance.now() - startTime.current;
    performanceMonitor.recordMetric(`${componentName}-render`, duration);
  });
  
  React.useEffect(() => {
    const duration = performance.now() - startTime.current;
    performanceMonitor.recordMetric(`${componentName}-mount`, duration);
  }, [componentName]);
};

// HOC for measuring component performance
export const withPerformanceMeasure = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  componentName: string
) => {
  const MeasuredComponent = React.forwardRef<any, P>((props, ref) => {
    usePerformanceMeasure(componentName);
    return React.createElement(WrappedComponent, { ...props, ref });
  });
  
  MeasuredComponent.displayName = `withPerformanceMeasure(${componentName})`;
  return MeasuredComponent;
};