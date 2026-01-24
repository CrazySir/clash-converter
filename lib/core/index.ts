/**
 * Core module exports
 * Includes interfaces, base classes, factory, and converter
 */

// Import registry first to auto-initialize all formats
import './registry';

export type {
  FormatType,
  ParseResult,
  ConversionResult,
  IFormatParser,
  IFormatGenerator,
} from './interfaces';

export {
  BaseFormatGenerator,
} from './base-generator';

export {
  FormatFactory,
  FormatNotRegisteredError,
} from './factory';

export {
  FormatConverter,
  convert,
  parseInput,
} from './converter';

export {
  initializeFormatRegistry,
} from './registry';
