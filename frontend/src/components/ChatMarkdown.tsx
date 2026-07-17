import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

/**
 * Renderiza el texto del asistente como Markdown seguro.
 *
 * - react-markdown NO renderiza HTML crudo por defecto -> protegido contra
 *   inyección (XSS) desde las respuestas del modelo.
 * - remark-gfm: convierte correos y URLs sueltas en enlaces clickeables.
 * - remark-breaks: respeta los saltos de línea simples del modelo.
 *
 * Los estilos van por componente porque la base de Tailwind resetea listas y
 * enlaces.
 */
export default function ChatMarkdown({ content }: { content: string }) {
  return (
    <div className="space-y-2 break-words [overflow-wrap:anywhere] [&_p]:leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          a: ({ node, ...props }) => (
            <a
              {...props}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-teal underline underline-offset-2 [overflow-wrap:anywhere] hover:opacity-80"
            />
          ),
          ul: ({ node, ...props }) => (
            <ul {...props} className="list-disc space-y-1 pl-4" />
          ),
          ol: ({ node, ...props }) => (
            <ol {...props} className="list-decimal space-y-1 pl-4" />
          ),
          strong: ({ node, ...props }) => (
            <strong {...props} className="font-bold" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
