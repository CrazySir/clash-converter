/**
 * Hysteria and Hysteria2 protocol adapters
 */

import type { ProxyNode } from '../types';
import type { IProtocolAdapter } from './protocol-adapter';

/**
 * Adapter for Hysteria v1 protocol
 */
export class HysteriaAdapter implements IProtocolAdapter {
  readonly type = 'hysteria';

  toClashJson(node: ProxyNode): Record<string, any> {
    return {
      type: 'hysteria',
      name: node.name,
      server: node.server,
      port: node.port,
      auth_str: node.auth_str || node.auth || '',
      protocol: node.protocol || 'udp',
      'skip-cert-verify': node['skip-cert-verify'] || false,
      sni: node.sni || '',
      up: node.up || 10,
      down: node.down || 50,
      alpn: node.alpn || (node.alpn === '' ? [] : ['h3']),
    };
  }

  toSingBoxJson(node: ProxyNode): Record<string, any> {
    return {
      tag: node.name,
      type: 'hysteria',
      server: node.server,
      server_port: node.port,
      auth: node.auth_str || node.auth || '',
      up_mbps: node.up || 10,
      down_mbps: node.down || 50,
      ...(node.sni && { server_name: node.sni }),
    };
  }

  toLink(node: ProxyNode): string {
    let link = `hysteria://${node.server}:${node.port}`;
    const params: string[] = [];
    if (node.protocol) params.push(`protocol=${node.protocol}`);
    const authValue = node.auth_str || node.auth;
    if (authValue) params.push(`auth=${encodeURIComponent(authValue)}`);
    if (node.sni) params.push(`peer=${encodeURIComponent(node.sni)}`);
    if (node['skip-cert-verify']) params.push('insecure=1');
    if (node.up) params.push(`upmbps=${node.up}`);
    if (node.down) params.push(`downmbps=${node.down}`);
    if (node.alpn) {
      const alpnValue = Array.isArray(node.alpn) ? node.alpn[0] : node.alpn;
      params.push(`alpn=${encodeURIComponent(alpnValue)}`);
    }
    if (params.length) link += `?${params.join('&')}`;
    link += `#${encodeURIComponent(node.name)}`;
    return link;
  }
}

/**
 * Adapter for Hysteria2 protocol
 */
export class Hysteria2Adapter implements IProtocolAdapter {
  readonly type = 'hysteria2';

  toClashJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      type: 'hysteria2',
      name: node.name,
      server: node.server,
      port: node.port,
      password: node.password,
    };

    if (node['skip-cert-verify']) obj['skip-cert-verify'] = node['skip-cert-verify'];
    if (node.sni) obj.sni = node.sni;

    return obj;
  }

  toSingBoxJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      tag: node.name,
      type: 'hysteria2',
      server: node.server,
      server_port: node.port,
      password: node.password,
      tls: {
        enabled: true,
      },
    };

    if (node.sni) {
      obj.tls.server_name = node.sni;
    }

    return obj;
  }

  toLink(node: ProxyNode): string {
    let link = `hysteria2://${node.password}@${node.server}:${node.port}`;
    const params: string[] = [];
    if (node.sni) params.push(`sni=${encodeURIComponent(node.sni)}`);
    if (node['skip-cert-verify']) params.push('insecure=1');
    if (params.length) link += `/?${params.join('&')}`;
    link += `#${encodeURIComponent(node.name)}`;
    return link;
  }
}
