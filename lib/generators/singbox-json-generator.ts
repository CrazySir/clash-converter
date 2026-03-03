/**
 * Sing-Box JSON format generator
 * Generates Sing-Box JSON configuration from ProxyNode array
 * Supports all 9 protocols: SS, SSR, VMess, VLESS, Trojan, Hysteria, Hysteria2, HTTP, SOCKS5
 */

import type { ProxyNode } from '../types';
import type { FormatType } from '../core/interfaces';
import { BaseFormatGenerator } from '../core/base-generator';
import { generateSingBoxConfig, SING_BOX_SUPPORTED_PROTOCOLS } from '../singbox/generator';

/**
 * Generator for Sing-Box JSON format
 * Supports all protocols (SSR is converted to Shadowsocks, SOCKS5 uses socks outbound)
 */
export class SingBoxJsonGenerator extends BaseFormatGenerator {
  readonly format: FormatType = 'sing-box';

  /**
   * Generate the header section of the JSON output
   * @param proxies - Filtered proxy nodes
   * @returns Empty string (header is part of generateSingBoxConfig)
   */
  protected generateHeader(_proxies: ProxyNode[]): string {
    return '';
  }

  /**
   * Generate the body section (main JSON content)
   * @param proxies - Filtered proxy nodes
   * @returns Complete JSON configuration
   */
  protected generateBody(proxies: ProxyNode[]): string {
    return generateSingBoxConfig(proxies);
  }

  /**
   * Generate the footer section
   * @returns Empty string (footer is part of generateSingBoxConfig)
   */
  protected generateFooter(): string {
    return '';
  }

  /**
   * Filter proxies to exclude unsupported protocols
   * @param proxies - All proxy nodes
   * @returns Filtered proxy nodes
   */
  public filterProxies(proxies: ProxyNode[]): ProxyNode[] {
    return proxies.filter(p => SING_BOX_SUPPORTED_PROTOCOLS.has(p.type));
  }

  /**
   * Get the set of protocols supported by Sing-Box
   * @returns Set of supported protocol types
   */
  getSupportedProtocols(): Set<string> {
    return SING_BOX_SUPPORTED_PROTOCOLS;
  }
}
