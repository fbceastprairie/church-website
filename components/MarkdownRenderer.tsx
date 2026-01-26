import React from 'react';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  const blocks: React.ReactNode[] = [];
  const lines = content.split('\n');
  
  let currentListType: 'ul' | 'ol' | null = null;
  let currentListItems: React.ReactNode[] = [];

  const parseInline = (text: string): React.ReactNode[] => {
    // Split by bold (**...**) and italic (*...*) markers
    // Note: This regex splits while keeping delimiters for processing
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
        return <strong key={index} className="font-bold">{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
        return <em key={index} className="italic">{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const flushList = () => {
    if (currentListType === 'ul') {
      blocks.push(
        <ul key={`list-${blocks.length}`} className="list-disc pl-6 mb-4 space-y-1 text-gray-700">
          {currentListItems}
        </ul>
      );
    } else if (currentListType === 'ol') {
      blocks.push(
        <ol key={`list-${blocks.length}`} className="list-decimal pl-6 mb-4 space-y-1 text-gray-700">
          {currentListItems}
        </ol>
      );
    }
    currentListType = null;
    currentListItems = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    
    // Check for Unordered List (Hyphen or Asterisk followed by space)
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      if (currentListType !== 'ul') flushList();
      currentListType = 'ul';
      currentListItems.push(<li key={`li-${index}`}>{parseInline(trimmed.substring(2))}</li>);
      return;
    }

    // Check for Ordered List (Number followed by dot and space)
    if (/^\d+\.\s/.test(trimmed)) {
      if (currentListType !== 'ol') flushList();
      currentListType = 'ol';
      const content = trimmed.replace(/^\d+\.\s/, '');
      currentListItems.push(<li key={`li-${index}`}>{parseInline(content)}</li>);
      return;
    }

    // Regular line or empty line
    flushList(); // End any active list

    if (trimmed === '') {
       // Optional: Add spacer for empty lines if desired, or just rely on margin
      return; 
    }

    blocks.push(
      <p key={`p-${index}`} className="mb-4 text-gray-800 leading-relaxed text-lg">
        {parseInline(line)}
      </p>
    );
  });

  flushList(); // Flush any remaining list at the end

  return <div className="markdown-content">{blocks}</div>;
};

export default MarkdownRenderer;