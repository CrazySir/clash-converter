/**
 * Backward compatibility module
 * Re-exports from the new core system for backward compatibility
 */

// Re-export types and functions from the new core system
export type {
  FormatType,
  ParseResult,
  ConversionResult,
} from '../core/interfaces';

export {
  parseInput,
  convert,
} from '../core';

// Re-export ProxyNode type for convenience
export type { ProxyNode } from '../types';
