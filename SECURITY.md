# Security Policy

## Supported Versions

We provide security updates for the following versions of TamperCell:

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | ✅ Fully supported |
| 1.0.x   | ✅ Security fixes only |
| < 1.0   | ❌ Not supported   |

## Reporting a Vulnerability

The TamperCell team takes security bugs seriously. We appreciate your efforts to responsibly disclose your findings, and will make every effort to acknowledge your contributions.

### How to Report Security Issues

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Email**: Send details to security@[your-domain] (if you have one)
2. **GitHub Security Advisories**: Use GitHub's private vulnerability reporting feature
3. **Direct Contact**: Contact the maintainer @ruriazz directly through GitHub

### What to Include

Please include the following information in your report:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting, etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

### Response Timeline

- **Initial Response**: We will acknowledge receipt of your vulnerability report within 48 hours
- **Assessment**: We will provide an initial assessment within 5 business days
- **Updates**: We will provide regular updates on our progress at least every 7 days
- **Resolution**: We will notify you when the vulnerability is fixed

### Safe Harbor

We support safe harbor for security researchers who:

- Make a good faith effort to avoid privacy violations, destruction of data, and interruption or degradation of services
- Only interact with accounts you own or with explicit permission of the account holder
- Do not access, modify, or delete data belonging to others
- Do not perform actions that could harm our users or degrade user experience
- Do not publicly disclose the vulnerability without our consent

## Security Considerations for Users

### Tampermonkey Security

When using TamperCell libraries in Tampermonkey scripts:

1. **Script Permissions**: Only grant necessary permissions (`@grant`)
2. **Content Security**: Be cautious with `@require` from external sources
3. **Data Handling**: Avoid storing sensitive data in userscripts
4. **Regular Updates**: Keep TamperCell libraries updated to latest versions

### Custom Console Security

The Custom Console library includes JavaScript execution capabilities:

- **Isolated Execution**: Code runs in the page context, not extension context
- **No Privilege Escalation**: Cannot access browser APIs beyond page permissions
- **User Responsibility**: Users should only execute trusted code
- **Debug Mode**: Disable in production environments

### Next Observer Security

The Next Observer library:

- **Read-Only Operation**: Only observes, doesn't modify application state
- **No Data Collection**: Doesn't transmit or store user data
- **Local Processing**: All detection happens locally in the browser

## Best Practices

### For Library Users

1. **Verify Integrity**: Always use official CDN links or verify package integrity
2. **Version Pinning**: Pin to specific versions in production
3. **Regular Updates**: Monitor for security updates and apply promptly
4. **Minimal Permissions**: Use minimal Tampermonkey permissions required
5. **Code Review**: Review userscripts before installation

### For Contributors

1. **Secure Coding**: Follow secure coding practices
2. **Input Validation**: Validate all external inputs
3. **Error Handling**: Implement proper error handling
4. **Dependency Management**: Keep dependencies updated
5. **Code Review**: All code changes require review

## Known Security Considerations

### JavaScript Execution (Custom Console)

- The Custom Console allows arbitrary JavaScript execution
- This is by design for debugging purposes
- Users should only execute trusted code
- Code runs with page-level permissions only

### DOM Manipulation

- Both libraries interact with the DOM
- Operations are read-only or additive (no destructive changes)
- No sensitive data is extracted or transmitted

### External Dependencies

- TamperCell has minimal external dependencies
- All dependencies are regularly audited for vulnerabilities
- Automated security scanning is in place

## Updates and Patches

Security updates will be:

1. **Prioritized**: Released as soon as possible
2. **Documented**: Listed in CHANGELOG.md with security markers
3. **Announced**: Communicated through GitHub releases
4. **Backwards Compatible**: When possible, without breaking existing functionality

## Contact

For questions about this security policy, please contact:

- GitHub Issues (for general questions)
- GitHub Security Advisories (for vulnerabilities)
- Email: [your-email] (if available)

Thank you for helping keep TamperCell and our users safe!