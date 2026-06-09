"use client";

import React, { useMemo, useState, useEffect } from 'react';
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

const TocLinks = ({ toc, onItemClick }: { toc: TocItem[], onItemClick?: () => void }) => (
  <nav className="flex flex-col space-y-1">
    {toc.map((item) => (
      <a 
        key={item.id}
        href={`#${item.id}`} 
        onClick={onItemClick}
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
);

export default function BlogContent({ markdownContent, title, description }: BlogContentProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Cerrar el menú al cambiar de tamaño (opcional, pero útil para evitar estados inconsistentes)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMenuOpen]);

  // Generar el índice de contenidos automáticamente
  const toc = useMemo(() => {
    // Buscamos títulos que empiecen por #, ## o ### (los más comunes para el índice)
    const headerRegex = /^(#{1,3})\s+(.*)/gm;
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
      
      {/* BOTÓN FLOTANTE MÓVIL */}
      <button 
        onClick={() => setIsMenuOpen(true)}
        className="lg:hidden fixed bottom-6 left-6 z-40 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center"
        aria-label="Abrir índice"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
      </button>

      {/* MENÚ MÓVIL (DRAWER) */}
      <div className={`lg:hidden fixed inset-0 z-50 transition-all duration-300 ${isMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
        {/* Backdrop */}
        <div 
          className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Panel con animación de slide */}
        <div className={`absolute inset-y-0 left-0 max-w-xs w-[80%] bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase">
              Índice
            </h3>
            <button 
              onClick={() => setIsMenuOpen(false)}
              className="p-2 -mr-2 text-gray-400 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-6">
            <TocLinks toc={toc} onItemClick={() => setIsMenuOpen(false)} />
          </div>
        </div>
      </div>

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
        
        {/* BARRA LATERAL (Desktop) */}
        <aside className="hidden lg:block lg:w-1/4">
          <div className="sticky top-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-6">
              Tabla de Contenidos
            </h3>
            <TocLinks toc={toc} />
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
              p: ({ ...props }) => <p className="text-black leading-relaxed mb-6" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 mb-6 text-black" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-2 mb-6 text-black" {...props} />,
              li: ({ ...props }) => <li className="ml-4 text-black" {...props} />,
              blockquote: ({ ...props }) => (
                <blockquote className="border-l-4 border-blue-500 pl-6 py-2 italic bg-blue-50 text-black my-8 rounded-r-lg" {...props} />
              ),
              table: ({ ...props }) => (
                <div className="overflow-x-auto my-8 rounded-xl border border-gray-200 shadow-sm">
                  <table className="min-w-full divide-y divide-gray-200" {...props} />
                </div>
              ),
              thead: ({ ...props }) => <thead className="bg-gray-50" {...props} />,
              th: ({ ...props }) => <th className="px-6 py-3 text-left text-xs font-bold text-gray-900 uppercase tracking-wider" {...props} />,
              td: ({ ...props }) => <td className="px-6 py-4 whitespace-nowrap text-sm text-black border-t border-gray-100" {...props} />,
              code(props: React.HTMLAttributes<HTMLElement> & { className?: string }) {
                const { children, className, ...rest } = props;
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
