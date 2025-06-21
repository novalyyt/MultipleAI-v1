
export interface CodeBlock {
  id: string;
  language: string;
  code: string;
  fileName?: string;
  startIndex: number;
  endIndex: number;
}

export interface ParsedMessage {
  text: string;
  codeBlocks: CodeBlock[];
}

/**
 * Parse message text to extract code blocks
 * Supports both triple backticks (```) and single backticks (`)
 */
export const parseCodeBlocks = (text: string): ParsedMessage => {
  const codeBlocks: CodeBlock[] = [];
  let processedText = text;

  // Regex for triple backticks with optional language specification
  const tripleBacktickRegex = /```(\w+)?\n?([\s\S]*?)```/g;
  
  // Regex for single backticks (inline code)
  const singleBacktickRegex = /`([^`\n]+)`/g;

  let match;
  let blockId = 0;

  // Extract triple backtick code blocks
  while ((match = tripleBacktickRegex.exec(text)) !== null) {
    const [fullMatch, language = 'text', code] = match;
    const startIndex = match.index;
    const endIndex = match.index + fullMatch.length;

    codeBlocks.push({
      id: `code-block-${blockId++}`,
      language: language.toLowerCase(),
      code: code.trim(),
      startIndex,
      endIndex,
    });
  }

  // Extract single backtick inline code (optional - you might want to handle this differently)
  const inlineCodeBlocks: Array<{match: string, index: number, code: string}> = [];
  while ((match = singleBacktickRegex.exec(text)) !== null) {
    const [fullMatch, code] = match;
    
    // Skip if this inline code is inside a triple backtick block
    const isInsideTripleBlock = codeBlocks.some(block => 
      match.index >= block.startIndex && match.index <= block.endIndex
    );

    if (!isInsideTripleBlock) {
      inlineCodeBlocks.push({
        match: fullMatch,
        index: match.index,
        code: code.trim()
      });
    }
  }

  return {
    text: processedText,
    codeBlocks
  };
};

/**
 * Replace code blocks in text with placeholder markers
 */
export const replaceCodeBlocksWithPlaceholders = (text: string, codeBlocks: CodeBlock[]): string => {
  let result = text;
  
  // Sort by startIndex in descending order to avoid index shifting issues
  const sortedBlocks = [...codeBlocks].sort((a, b) => b.startIndex - a.startIndex);
  
  sortedBlocks.forEach(block => {
    const placeholder = `__CODE_BLOCK_${block.id}__`;
    result = result.substring(0, block.startIndex) + placeholder + result.substring(block.endIndex);
  });

  return result;
};

/**
 * Get supported languages for syntax highlighting
 */
export const getSupportedLanguages = (): string[] => {
  return [
    'javascript', 'typescript', 'jsx', 'tsx',
    'python', 'java', 'c', 'cpp', 'csharp',
    'php', 'ruby', 'go', 'rust', 'swift',
    'kotlin', 'scala', 'dart', 'r',
    'html', 'css', 'scss', 'sass', 'less',
    'xml', 'json', 'yaml', 'toml',
    'sql', 'mongodb', 'graphql',
    'bash', 'shell', 'powershell', 'batch',
    'dockerfile', 'makefile',
    'markdown', 'latex', 'text'
  ];
};

/**
 * Detect language from file extension or content
 */
export const detectLanguage = (text: string, fileName?: string): string => {
  if (fileName) {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const extensionMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'jsx',
      'tsx': 'tsx',
      'py': 'python',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cc': 'cpp',
      'cxx': 'cpp',
      'cs': 'csharp',
      'php': 'php',
      'rb': 'ruby',
      'go': 'go',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'scala': 'scala',
      'dart': 'dart',
      'r': 'r',
      'html': 'html',
      'htm': 'html',
      'css': 'css',
      'scss': 'scss',
      'sass': 'sass',
      'less': 'less',
      'xml': 'xml',
      'json': 'json',
      'yml': 'yaml',
      'yaml': 'yaml',
      'toml': 'toml',
      'sql': 'sql',
      'sh': 'bash',
      'bash': 'bash',
      'zsh': 'bash',
      'fish': 'bash',
      'ps1': 'powershell',
      'bat': 'batch',
      'cmd': 'batch',
      'dockerfile': 'dockerfile',
      'makefile': 'makefile',
      'md': 'markdown',
      'tex': 'latex',
      'txt': 'text'
    };

    if (extension && extensionMap[extension]) {
      return extensionMap[extension];
    }
  }

  // Simple content-based detection
  const contentPatterns: Array<[RegExp, string]> = [
    [/^#!/, 'bash'],
    [/function\s+\w+\s*\(/m, 'javascript'],
    [/def\s+\w+\s*\(/m, 'python'],
    [/class\s+\w+/m, 'java'],
    [/SELECT\s+.*FROM/mi, 'sql'],
    [/<\?php/m, 'php'],
    [/<html/mi, 'html'],
    [/{\s*"[\w-]+"\s*:/m, 'json'],
  ];

  for (const [pattern, language] of contentPatterns) {
    if (pattern.test(text)) {
      return language;
    }
  }

  return 'text';
};