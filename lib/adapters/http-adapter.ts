/**
 * HTTP protocol adapter
 */

import type { ProxyNode } from '../types';
import type { IProtocolAdapter } from './protocol-adapter';

/**
 * Adapter for HTTP protocol
 */
export class HTTPAdapter implements IProtocolAdapter {
  readonly type = 'http';

  toClashJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      type: 'http',
      name: node.name,
      server: node.server,
      port: node.port,
    };

    if (node.username) obj.username = node.username;
    if (node.password) obj.password = node.password;
    if (node.tls) obj.tls = node.tls;

    return obj;
  }

  toSingBoxJson(node: ProxyNode): Record<string, any> {
    return {
      tag: node.name,
      type: 'http',
      server: node.server,
      server_port: node.port,
      users: [
        {
          username: node.username,
          password: node.password,
        },
      ],
      set_system_proxy: true,
    };
  }

  toLink(node: ProxyNode): string {
    let link = `http://`;
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
