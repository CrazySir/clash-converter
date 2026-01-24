/**
 * Sing-Box JSON format parser
 * Parses Sing-Box JSON configuration into ProxyNode array
 */

import type { IFormatParser, FormatType } from '../core/interfaces';
import { parseSingBoxToProxies } from '../singbox/parser';

/**
 * Parser for Sing-Box JSON format
 */
export class SingBoxJsonParser implements IFormatParser {
  readonly format: FormatType = 'sing-box';

  /**
   * Parse Sing-Box JSON configuration
   * @param input - The input string containing Sing-Box JSON configuration
   * @returns ParseResult containing proxies, unsupported protocols, and filtered counts
   */
  parse(input: string): import('../core/interfaces').ParseResult {
    return parseSingBoxToProxies(input);
  }
}
