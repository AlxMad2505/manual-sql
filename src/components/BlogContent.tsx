"use client";

import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';

import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface BlogContentProps {
  markdownContent: string;
  title: string;
  description: string;
}

interface TocItem {
  id: string;
  text: string;
  level: number;
}

// Función auxiliar para generar IDs consistentes.
const slugify = (text: string) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u00C0-\u00FF-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export default function BlogContent({ markdownContent, title, description }: BlogContentProps) {
  // Generar el índice de contenidos automáticamente
  const toc = useMemo(() => {
    // Buscamos títulos que empiecen por ## o ### (los más comunes para el índice)
    const headerRegex = /^(#{2,3})\s+(.*)/gm;
    const items: TocItem[] = [];
    let match;

    while ((match = headerRegex.exec(markdownContent)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      
      // Creamos el ID quitando símbolos comunes de Markdown que podrían estar en el texto
      const cleanText = text.replace(/[`*#]/g, '');
      const id = slugify(cleanText);
      
      items.push({ id, text: cleanText, level });
    }
    return items;
  }, [markdownContent]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* HEADER */}
      {(title || description) && (
        <header className="mb-10 border-b border-gray-200 pb-8">
          {title && (
            <h1 className="text-4xl font-extrabold text-black tracking-tight sm:text-5xl mb-4">
              {title}
            </h1>
          )}
          {description && (
            <p className="text-xl text-black leading-relaxed">
              {description}
            </p>
          )}
        </header>
      )}

      {/* GRID PRINCIPAL */}
      <div className="flex flex-col lg:flex-row gap-12">
        
        {/* BARRA LATERAL */}
        <aside className="lg:w-1/4">
          <div className="sticky top-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6">
              Tabla de Contenidos
            </h3>
            <nav className="flex flex-col space-y-1">
              {toc.map((item) => (
                <a 
                  key={item.id}
                  href={`#${item.id}`} 
                  className={`
                    hover:text-blue-600 transition-colors py-1.5 border-l-2 pl-4
                    ${item.level === 3 ? 'ml-4 text-[13px] border-transparent' : 'text-sm font-semibold border-transparent hover:border-blue-200'}
                    text-black
                  `}
                >
                  {item.text}
                </a>
              ))}
              {toc.length === 0 && (
                <p className="text-sm text-gray-400 italic">No se encontraron subtítulos</p>
              )}
            </nav>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL: Renderizado del Markdown */}
        <article className="lg:w-3/4 prose prose-slate prose-lg max-w-none 
          prose-headings:text-black prose-headings:font-bold
          prose-p:text-black
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-code:text-blue-600 prose-code:bg-blue-50 prose-code:px-1 prose-code:rounded
          prose-pre:bg-gray-900 prose-pre:shadow-lg
          prose-img:rounded-2xl prose-img:shadow-md">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]} 
            rehypePlugins={[rehypeSlug]}
            components={{
              h1: (props) => <h1 className="text-4xl font-bold text-black mb-6 mt-10 scroll-mt-24" {...props} />,
              h2: (props) => <h2 className="text-3xl font-bold text-black mb-4 mt-12 pb-2 border-b border-gray-100 scroll-mt-24" {...props} />,
              h3: (props) => <h3 className="text-2xl font-bold text-black mb-3 mt-8 scroll-mt-24" {...props} />,
              h4: (props) => <h4 className="text-xl font-bold text-black mb-2 mt-6 scroll-mt-24" {...props} />,
              p: ({node, ...props}) => <p className="text-black leading-relaxed mb-6" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-2 mb-6 text-black" {...props} />,
              ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-2 mb-6 text-black" {...props} />,
              li: ({node, ...props}) => <li className="ml-4 text-black" {...props} />,
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-blue-500 pl-6 py-2 italic bg-blue-50 text-black my-8 rounded-r-lg" {...props} />
              ),
              table: ({node, ...props}) => (
                <div className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200" {...props} />
                </div>
              ),
              thead: ({node, ...props}) => <thead className="bg-gray-50" {...props} />,
              th: ({node, ...props}) => <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider" {...props} />,
              td: ({node, ...props}) => <td className="px-6 py-4 whitespace-nowrap text-sm text-black border-t border-gray-100" {...props} />,
              code(props: any) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || '');
                const language = match ? match[1] : '';
                
                if (match) {
                  return (
                    <div className="my-8 relative group">
                      {language && (
                        <span className="absolute right-4 top-2 text-xs font-mono text-black uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-opacity z-20">
                          {language}
                        </span>
                      )}
                      <div className="rounded-xl overflow-hidden shadow-2xl border border-gray-400">
                        <SyntaxHighlighter
                          style={{
                            ...oneDark,
                            'keyword': { color: '#0011ff' },
                            'function': { color: '#4a9676' },
                            'operator': { color: '#4a9676' },
                            'class-name': { color: '#000000' },
                            'attr-name': { color: '#000000' },
                            'boolean': { color: '#000000' },
                            'constant': { color: '#000000' },
                            'variable': { color: '#000000' },
                            'property': { color: '#000000' },
                            'string': { color: '#ff5900' },
                            'comment': { color: '#00d0ff' },
                          }}
                          language={language}
                          PreTag="div"
                          useInlineStyles={true}
                          codeTagProps={{
                            style: {
                              backgroundColor: 'transparent',
                              textShadow: 'none',
                              color: '#000000'
                            }
                          }}
                          customStyle={{
                            margin: 0,
                            padding: '1.5rem',
                            fontSize: '14px',
                            lineHeight: '1.6',
                            backgroundColor: '#ffffff',
                            textShadow: 'none',
                            color: '#000000'
                          }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      </div>
                    </div>
                  );
                }

                return (
                  <code className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono text-sm font-semibold border border-blue-100" {...rest}>
                    {children}
                  </code>
                );
              }
            }}
          >
            {markdownContent}
          </ReactMarkdown>
        </article>

      </div>
    </div>
  );
}
