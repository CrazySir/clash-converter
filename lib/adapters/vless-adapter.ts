/**
 * VLESS protocol adapter
 */

import type { ProxyNode } from '../types';
import type { IProtocolAdapter } from './protocol-adapter';

/**
 * Adapter for VLESS protocol
 */
export class VLESSAdapter implements IProtocolAdapter {
  readonly type = 'vless';

  toClashJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      type: 'vless',
      name: node.name,
      server: node.server,
      port: node.port,
      uuid: node.uuid,
      network: node.network || 'tcp',
    };

    if (node.tls !== undefined) obj.tls = node.tls;
    if (node.servername) obj.servername = node.servername;
    if (node['skip-cert-verify']) obj['skip-cert-verify'] = node['skip-cert-verify'];
    if (node.flow) obj.flow = node.flow;
    if (node['reality-opts']) obj['reality-opts'] = node['reality-opts'];
    if (node['client-fingerprint']) obj['client-fingerprint'] = node['client-fingerprint'];
    if (node['ws-opts']) obj['ws-opts'] = node['ws-opts'];

    return obj;
  }

  toSingBoxJson(node: ProxyNode): Record<string, any> {
    const obj: Record<string, any> = {
      tag: node.name,
      type: 'vless',
      server: node.server,
      server_port: node.port,
      uuid: node.uuid,
    };

    if (node.flow) obj.flow = node.flow;

    if (node.tls || node.servername) {
      obj.tls = {
        enabled: true,
        ...(node.servername && { server_name: node.servername }),
      };
    }

    if (node['reality-opts']) {
      if (!obj.tls) obj.tls = { enabled: true };
      obj.tls.reality = {
        enabled: true,
        public_key: node['reality-opts']['public-key'] || '',
        short_id: node['reality-opts']['short-id'] || '',
      };
    }

    if (node['skip-cert-verify']) {
      if (!obj.tls) obj.tls = { enabled: true };
      obj.tls.insecure = node['skip-cert-verify'];
    }

    return obj;
  }

  toLink(node: ProxyNode): string {
    let link = `vless://${node.uuid}@${node.server}:${node.port}`;
    const params: string[] = [];
    params.push(`security=${node.tls ? 'tls' : 'none'}`);
    params.push(`type=${node.network || 'tcp'}`);
    params.push('encryption=none');
    if (node.flow && node.flow !== '') params.push(`flow=${node.flow}`);
    if (node.network === 'tcp' || !node.flow || node.flow === '') params.push('headerType=none');
    if (node.sni) params.push(`sni=${encodeURIComponent(node.sni)}`);
    if (node['skip-cert-verify']) params.push('allowInsecure=1');
    if (params.length) link += `?${params.join('&')}`;
    link += `#${encodeURIComponent(node.name)}`;
    return link;
  }
}
