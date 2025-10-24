// Helper function to format AI response with proper code blocks, tables, etc.
export const formatResponse = (text) => {
  let formatted = text;

  // Format code blocks with language and copy button (MUST BE FIRST)
  formatted = formatted.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    const language = lang || 'code';
    const escapedCode = escapeHtml(code.trim());
    const encodedCode = encodeURIComponent(code.trim());
    return `<pre><div class="code-header"><span>${language}</span><button class="copy-button" onclick="window.copyCode(this, '${encodedCode}')"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>Copy</button></div><code>${escapedCode}</code></pre>`;
  });

  // Format inline code (BEFORE bold/italic)
  formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');

  // Format bold text with double asterisks (BEFORE single asterisks)
  formatted = formatted.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

  // Format italic text with single asterisk (AFTER bold)
  formatted = formatted.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em>$1</em>');

  // Format headers (h4 first, then h3, h2, h1)
  formatted = formatted.replace(/^#### (.+)$/gm, '<h4>$1</h4>');
  formatted = formatted.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  formatted = formatted.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  formatted = formatted.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Format unordered lists
  formatted = formatted.replace(/^\* (.+)$/gm, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*?<\/li>\s*)+/g, '<ul>$&</ul>');

  // Format ordered lists
  formatted = formatted.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
  formatted = formatted.replace(/(<li>.*?<\/li>\s*)+/g, (match) => {
    if (!match.includes('<ul>')) {
      return '<ol>' + match + '</ol>';
    }
    return match;
  });

  // Format tables (markdown style)
  formatted = formatted.replace(/\|(.+)\|\n\|[-:\s|]+\|\n((?:\|.+\|\n?)+)/g, (match, header, rows) => {
    const headers = header.split('|').filter(h => h.trim()).map(h => `<th>${h.trim()}</th>`).join('');
    const rowsHtml = rows.trim().split('\n').map(row => {
      const cells = row.split('|').filter(c => c.trim()).map(c => `<td>${c.trim()}</td>`).join('');
      return `<tr>${cells}</tr>`;
    }).join('');
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rowsHtml}</tbody></table>`;
  });

  // Format blockquotes
  formatted = formatted.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');

  // Format line breaks
  formatted = formatted.replace(/\n\n/g, '</p><p>');
  formatted = '<p>' + formatted + '</p>';

  // Clean up empty paragraphs
  formatted = formatted.replace(/<p><\/p>/g, '');
  formatted = formatted.replace(/<p>\s*<\/p>/g, '');

  return formatted;
};

// Helper function to escape HTML
const escapeHtml = (text) => {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
};

// Add global copy function for code blocks
if (typeof window !== 'undefined') {
  window.copyCode = function(button, encodedCode) {
    const code = decodeURIComponent(encodedCode);
    navigator.clipboard.writeText(code).then(() => {
      const originalHTML = button.innerHTML;
      button.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>Copied!';
      button.classList.add('copied');
      setTimeout(() => {
        button.innerHTML = originalHTML;
        button.classList.remove('copied');
      }, 2000);
    });
  };
}