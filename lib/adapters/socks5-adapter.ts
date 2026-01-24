/**
 * SOCKS5 protocol adapter
 */

import type { ProxyNode } from '../types';
import type { IProtocolAdapter } from './protocol-adapter';

/**
 * Adapter for SOCKS5 protocol
 */
export class SOCKS5Adapter implements IProtocolAdapter {
  readonly type = 'socks5';

  toClashJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      type: 'socks5',
      name: node.name,
      server: node.server,
      port: node.port,
    };

    if (node.username) obj.username = node.username;
    if (node.password) obj.password = node.password;

    return obj;
  }

  toSingBoxJson(_node: ProxyNode): Record<string, any> {
    // Sing-Box doesn't support SOCKS5 as an outbound
    // This is a placeholder for potential future support
    throw new Error('Sing-Box does not support SOCKS5 as an outbound protocol');
  }

  toLink(node: ProxyNode): string {
    let link = `socks5://`;
    if (node.username && node.password) {
      link += `${encodeURIComponent(node.username)}:${encodeURIComponent(node.password)}@`;
    }
    link += `${node.server}:${node.port}`;
    if (!this.isDefaultName(node.name)) {
      link += `#${encodeURIComponent(node.name)}`;
    }
    return link;
  }

  /**
   * Check if a name is a default name (should not have suffix)
   */
  private isDefaultName(name: string): boolean {
    return /^defaultName_\d+$/.test(name);
  }
}
