/**
 * Clash YAML format parser
 * Parses Clash YAML configuration into ProxyNode array
 */

import type { ProxyNode } from '../types';
import type { IFormatParser, FormatType, ParseResult } from '../core/interfaces';
import { parseYamlToProxies } from '../clash/parser/yaml';

/**
 * Parser for Clash YAML format (both Meta and Premium)
 */
export class ClashYamlParser implements IFormatParser {
  readonly format: FormatType = 'clash-meta'; // Can also handle clash-premium

  /**
   * Parse Clash YAML configuration
   * @param input - The input string containing Clash YAML configuration
   * @returns ParseResult containing proxies
   */
  parse(input: string): ParseResult {
    const proxies = parseYamlToProxies(input);
    return {
      proxies,
      unsupported: [],
      filteredCounts: {},
    };
  }
}
