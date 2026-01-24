/**
 * TXT format parser (proxy links)
 * Parses plain text proxy links into ProxyNode array
 */

import type { ProxyNode } from '../types';
import type { IFormatParser, FormatType } from '../core/interfaces';
import { parseMultipleProxies } from './index';

/**
 * Parser for plain text proxy link format
 */
export class TxtParser implements IFormatParser {
  readonly format: FormatType = 'txt';

  /**
   * Parse plain text proxy links
   * @param input - The input string containing proxy links (one per line)
   * @returns ParseResult containing proxies and unsupported protocols
   */
  parse(input: string): import('../core/interfaces').ParseResult {
    const { proxies, unsupported } = parseMultipleProxies(input);
    return {
      proxies,
      unsupported,
      filteredCounts: {},
    };
  }
}
