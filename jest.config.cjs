module.exports = {
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/__mocks__/styleMock.cjs',
  },
  transform: {
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(react-markdown|vfile|vfile-message|unist-.*|unified|bail|is-plain-obj|trough|remark-.*|mdast-util-.*|micromark.*|decode-named-character-reference|character-entities|property-information|hast-util-.*|space-separated-tokens|comma-separated-tokens|web-namespaces|zwitch|html-void-elements|ccount|escape-string-regexp|markdown-table|trim-lines|estree-util-is-identifier-name|hastscript|parse-entities|character-reference-invalid|is-decimal|is-hexadecimal|is-alphanumerical|is-alphabetical|character-entities-legacy|character-entities-html4|stringify-entities|longest-streak|devlop)/)',
  ],
};
