#!/usr/bin/env tsx
/**
 * Verify Loon output after removing non-existent region groups
 */

import { FormatFactory } from '../lib/core/factory';
import { readFileSync } from 'fs';

// Import registry
import '../lib/core/registry';

const input = readFileSync('./test/loon/input.txt', 'utf-8');
const parser = FormatFactory.createParser('txt');
const parseResult = parser.parse(input);

const generator = FormatFactory.createGenerator('loon');
const output = generator.generate(parseResult.proxies);

// These should NOT appear in the output
const nonExistentGroups = [
  '🇭🇰 香港节点',
  '🇯🇵 日本节点',
  '🇺🇲 美国节点',
  '🇸🇬 狮城节点',
  '🇨🇳 台湾节点',
  '🇰🇷 韩国节点',
  '🎥 奈飞节点',
];

console.log('=== Verification: Non-existent groups removed ===');
nonExistentGroups.forEach(groupName => {
  if (output.includes(groupName)) {
    console.log(`❌ FAIL: Found "${groupName}" in output`);
  } else {
    console.log(`✅ PASS: "${groupName}" not found in output`);
  }
});

// These SHOULD appear in the output
const validGroups = [
  '🚀 节点选择',
  '🚀 手动切换',
  '📲 电报消息',
  '🎯 全球直连',
  '🐟 漏网之鱼',
];

console.log('\n=== Verification: Valid groups present ===');
validGroups.forEach(groupName => {
  if (output.includes(groupName)) {
    console.log(`✅ PASS: Found "${groupName}" in output`);
  } else {
    console.log(`❌ FAIL: "${groupName}" not found in output`);
  }
});

// Show [Proxy Group] section
const groupMatch = output.match(/\[Proxy Group\]([\s\S]*?)\[/);
if (groupMatch) {
  console.log('\n=== [Proxy Group] Section ===');
  const groups = groupMatch[1].trim().split('\n');
  groups.forEach(line => console.log(line));
}
