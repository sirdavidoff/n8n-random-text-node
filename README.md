# A random text generator for n8n

An [n8n](n8n.io) node to generate random text in the [lorem-ipsum](https://en.wikipedia.org/wiki/Lorem_ipsum) style. Can be configured to generate plaintext, HTML or markdown.

Based on the [Loripsum](https://loripsum.net/) and [Lorem Markdownum](https://jaspervdj.be/lorem-markdownum/) APIs.

## Options

**Plaintext**
- Number of paragraphs
- Paragraph length

**HTML**
- Number of paragraphs
- Paragraph length
- Headers
- Lists
    - ul lists
    - ol lists
    - dl lists
- Inline styling
- Links
- Block quotes
- Code blocks

**Markdown**
- Number of paragraphs
- Headers
    - Header style [hash-style | underline-style]
- Lists
- Inline styling
    - Emphasis with [underscores | asterisks]
- Links
    - Link style [inline-style | reference-style]
- Block quotes
- Code blocks
    - Code block style [indented | backticked]
