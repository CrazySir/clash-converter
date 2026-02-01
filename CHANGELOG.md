# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-02-01

### Added
- **Loon Format Support**: Convert proxy configurations to Loon .conf format
  - Full INI-style configuration with [General], [Proxy], [Proxy Group], [Rule], [Remote Rule] sections
  - Support for SS, SSR, VMess, and Trojan protocols
  - Automatic proxy group generation with optimized routing rules
  - Comprehensive rule set with ACL4SSR rulesets
  - MITM configuration empty by default (can be customized by users)
- **Protocol Filtering Notifications**: Toast notifications when nodes are filtered due to format incompatibility
  - Clash Premium: VLESS, Hysteria, Hysteria2 filtered with warnings
  - Sing-Box: SSR, SOCKS5 filtered with warnings
  - Loon: HTTP, HTTPS, SOCKS5, VLESS, Hysteria, Hysteria2 filtered with warnings

### Enhanced
- **Parser Improvements**
  - HTTP parser now correctly skips Telegram links to prevent conflicts
  - Better handling of edge cases in protocol detection
- **Loon Generator**
  - Extended BaseFormatGenerator with Loon-specific configuration
  - Automatic proxy name deduplication and formatting
  - Optimized rule sets for Chinese and international traffic

### Technical
- Added `lib/loon/` directory with Loon-specific generator and configuration
- Implemented `LoonGenerator` class extending `BaseFormatGenerator`
- Created ACL4SSR-based rule configuration with remote rule support
- Added format registry support for Loon format

### Fixed
- HTTP parser conflict with Telegram SOCKS links (both start with `https://`)
- Toast notification state management for filtered protocol counts

## [1.0.0] - 2025-01-25

### Added
- Footer component with copyright and contact email
- Environment variable support for contact email configuration
- Environment variable control for DNS configuration in Clash YAML output
- About page with project information
- Resources page with proxy client downloads and installation scripts
- Sing-Box format support (input and output)
- MIT License for open-source distribution
- CHANGELOG.md for version tracking

### Enhanced
- **SEO Optimization**
  - Page-specific metadata for About and Resources pages
  - 114+ targeted keywords for better search ranking
  - Structured data: SoftwareApplication, FAQPage, HowTo, AggregateRating, ProfilePage, CollectionPage
  - Enhanced sitemap with all pages and proper locale support
  - Long-tail keyword coverage for better organic traffic
- **Architecture**
  - Core architecture with Factory/Registry patterns
  - Protocol adapter pattern for clean abstraction
  - Comprehensive type definitions and interfaces

### Fixed
- Sitemap format issue (lastModified property name)
- Compatibility issues with Clash Premium (proper protocol filtering)

### Refactored
- Component directory organization with semantic structure
- Library directory organization with clear separation of concerns
- Improved code maintainability and extensibility

### Updated
- Favicon assets with multiple sizes for better browser support
- Translation text refinements for better clarity

## [0.1.0] - 2024-12-XX

### Added
- Initial release of ClashConverter
- Support for 9 proxy protocols: SS, SSR, VMess, VLESS, Trojan, Hysteria, Hysteria2, HTTP, SOCKS5
- Bidirectional conversion between proxy links and Clash YAML
- Clash Meta (Mihomo) and Clash Premium output formats
- CodeMirror integration for syntax-highlighted preview
- Multi-language support (English and Simplified Chinese)
- Dark/Light theme support
- Client-side processing for privacy
- Proxy node configuration dialogs
- Client download and installation script recommendations

### Features
- Real-time preview with syntax highlighting
- Protocol-specific proxy node editing
- Automatic proxy group generation
- DNS configuration with fake-ip mode
- Comprehensive Clash routing rules
- SEO optimization with structured data
- Locale detection and automatic redirection
