/**
 * TDD Test: Verify that non-existent region node groups are removed
 * These groups should not appear in the generated Loon configuration
 * because they don't exist in the actual proxy list
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { FormatFactory } from '@/lib/core/factory';
import { LOON_PROXY_GROUPS } from '@/lib/loon/config/loon-config';

// Import registry to auto-initialize
import '@/lib/core/registry';

describe('[TDD] Loon Region Groups Cleanup', () => {
  // These groups should NOT exist as they reference non-existent nodes
  const nonExistentGroups = [
    '🇭🇰 香港节点',
    '🇯🇵 日本节点',
    '🇺🇲 美国节点',
    '🇸🇬 狮城节点',
    '🇨🇳 台湾节点',
    '🇰🇷 韩国节点',
    '🎥 奈飞节点',
  ];

  describe('LOON_PROXY_GROUPS configuration', () => {
    it('should NOT contain non-existent region node groups', () => {
      const groupNames = LOON_PROXY_GROUPS.map(g => g.name);

      nonExistentGroups.forEach(groupName => {
        expect(groupNames).not.toContain(groupName);
      });
    });

    it('should NOT reference non-existent groups in other groups', () => {
      LOON_PROXY_GROUPS.forEach(group => {
        group.proxies.forEach(proxy => {
          expect(nonExistentGroups).not.toContain(proxy);
        });
      });
    });
  });

  describe('Generated Loon configuration', () => {
    let testInput: string;
    let generatedOutput: string;

    beforeEach(() => {
      // Sample input with SS, SSR, VMess, Trojan proxies
      testInput = [
        'ss://YWVzLTI1Ni1nY206ZzVNZUQ2RnQzQ1dsSklkQDE5OC41Ny4yNy4yMTg6NTAwNA==#TestProxy1',
        'vmess://eyJhZGQiOiIxNTQuMjMuMTkwLjE2MiIsInBzIjoiVGVzdFByb3h5MiIsInBvcnQiOjQ0MywiaWQiOiJiOTk4NDY3NC1mNzcxLTRlNjctYTE5OC1jN2U2MDcyMGJhMmMifQ==',
        'trojan://password@server.com:443#TestProxy3',
      ].join('\n');

      const parser = FormatFactory.createParser('txt');
      const parseResult = parser.parse(testInput);
      const generator = FormatFactory.createGenerator('loon');
      generatedOutput = generator.generate(parseResult.proxies);
    });

    it('should NOT contain non-existent region group names in output', () => {
      nonExistentGroups.forEach(groupName => {
        expect(generatedOutput).not.toContain(groupName);
      });
    });

    it('should contain valid group names in output', () => {
      // These groups SHOULD exist
      const validGroups = [
        '🚀 节点选择',
        '🚀 手动切换',
        '📲 电报消息',
        '🎯 全球直连',
        '🐟 漏网之鱼',
      ];

      validGroups.forEach(groupName => {
        expect(generatedOutput).toContain(groupName);
      });
    });

    it('should have 🚀 手动切换 reference actual proxy names', () => {
      expect(generatedOutput).toContain('🚀 手动切换');
      // Should contain actual proxy names like TestProxy1, TestProxy2, etc.
      expect(generatedOutput).toContain('TestProxy');
    });

    it('should generate valid Loon INI format', () => {
      expect(generatedOutput).toContain('[General]');
      expect(generatedOutput).toContain('[Proxy]');
      expect(generatedOutput).toContain('[Proxy Group]');
      expect(generatedOutput).toContain('[Rule]');
    });
  });
});
