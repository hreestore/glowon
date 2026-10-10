// import "./code-highlight-block.css";

// import { useMemo } from "react";
// import remarkGfm from "remark-gfm";
// import rehypeRaw from "rehype-raw";
// import rehypeHighlight from "rehype-highlight";
// import { mergeClasses, isExternalLink } from "minimal-shared/utils";

// import Link from "@mui/material/Link";

// import { RouterLink } from "@/routes/components";

// import { Image } from "../image";
// import { MarkdownRoot } from "./styles";
// import { markdownClasses } from "./classes";
// import { htmlToMarkdown, isMarkdownContent } from "./html-to-markdown";

// // ----------------------------------------------------------------------

// export function Markdown({ children, sx, className, ...other }) {
//   const content = useMemo(() => {
//     if (isMarkdownContent(`${children}`)) {
//       return children;
//     }
//     return htmlToMarkdown(`${children}`.trim());
//   }, [children]);

//   return (
//     <MarkdownRoot
//       children={content}
//       components={components}
//       rehypePlugins={rehypePlugins}
//       /* base64-encoded images
//        * https://github.com/remarkjs/react-markdown/issues/774
//        * urlTransform={(value) => value}
//        */
//       className={mergeClasses([markdownClasses.root, className])}
//       sx={sx}
//       {...other}
//     />
//   );
// }

// const rehypePlugins = [
//   rehypeRaw,
//   rehypeHighlight,
//   [remarkGfm, { singleTilde: false }],
// ];

// const components = {
//   img: ({ ...other }) => (
//     <Image
//       ratio="16/9"
//       className={markdownClasses.content.image}
//       sx={{ borderRadius: 2 }}
//       {...other}
//     />
//   ),
//   a: ({ href, children, node, ...other }) => {
//     const linkProps = isExternalLink(href)
//       ? { target: "_blank", rel: "noopener" }
//       : { component: RouterLink };

//     return (
//       <Link
//         {...linkProps}
//         href={href}
//         className={markdownClasses.content.link}
//         {...other}
//       >
//         {children}
//       </Link>
//     );
//   },
//   pre: ({ children }) => (
//     <div className={markdownClasses.content.codeBlock}>
//       <pre>{children}</pre>
//     </div>
//   ),
//   code({ className, children, node, ...other }) {
//     const language = /language-(\w+)/.exec(className || "");

//     return language ? (
//       <code {...other} className={className}>
//         {children}
//       </code>
//     ) : (
//       <code {...other} className={markdownClasses.content.codeInline}>
//         {children}
//       </code>
//     );
//   },
// };
'use client';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeHighlight from 'rehype-highlight';
import clsx from 'clsx';

import { isExternalLink } from 'minimal-shared/utils';
import { RouterLink } from '@/routes/components';
import { Image } from '../image';
import { htmlToMarkdown, isMarkdownContent } from './html-to-markdown';

// ------------------------------------------------------

export function Markdown({ children, className = '', ...other }) {
  const formattedContent = useMemo(() => {
    if (!children) return '';
    const str = `${children}`.trim();

    // If it contains HTML tags (like <p>, <ul>, <h3>, <strong>)
    if (/<[a-z][\s\S]*>/i.test(str)) {
      return { isHtml: true, content: str };
    }

    // If it's already markdown format
    if (isMarkdownContent(str)) {
      return { isHtml: false, content: str };
    }

    // Otherwise it's HTML converted to markdown or raw text with newlines
    const converted = htmlToMarkdown(str);
    return { isHtml: false, content: converted };
  }, [children]);

  if (formattedContent.isHtml) {
    return (
      <div
        className={clsx(
          'prose prose-sm max-w-none dark:prose-invert overflow-hidden break-words [word-break:break-word]',
          '[&_p]:mb-3 [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-4 [&_h1]:mb-2',
          '[&_h2]:text-lg [&_h2]:font-bold [&_h2]:mt-4 [&_h2]:mb-2',
          '[&_h3]:text-base [&_h3]:font-bold [&_h3]:mt-3 [&_h3]:mb-1.5',
          '[&_h4]:text-sm [&_h4]:font-bold [&_h4]:mt-3 [&_h4]:mb-1',
          '[&_ul]:!list-disc [&_ul]:!list-outside [&_ul]:!pl-6 [&_ul]:mb-3',
          '[&_ol]:!list-decimal [&_ol]:!list-outside [&_ol]:!pl-6 [&_ol]:mb-3',
          '[&_li]:!display-list-item [&_li]:mb-1 [&_li]:leading-relaxed [&_table]:w-full [&_table]:overflow-x-auto',
          className
        )}
        dangerouslySetInnerHTML={{ __html: formattedContent.content }}
        {...other}
      />
    );
  }

  return (
    <ReactMarkdown
      {...other}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw, rehypeHighlight]}
      components={components}
      className={clsx(
        'prose prose-sm max-w-none dark:prose-invert overflow-hidden break-words [word-break:break-word]',
        '[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5',
        className
      )}
    >
      {formattedContent.content}
    </ReactMarkdown>
  );
}

// ------------------------------------------------------

const components = {
  // LISTS
  ul: ({ children, ...props }) => (
    <ul
      className="pl-6 my-3 space-y-1 text-gray-700"
      style={{ listStyleType: 'disc', listStylePosition: 'outside' }}
      {...props}
    >
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol
      className="pl-6 my-3 space-y-1 text-gray-700"
      style={{ listStyleType: 'decimal', listStylePosition: 'outside' }}
      {...props}
    >
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" style={{ display: 'list-item' }} {...props}>
      {children}
    </li>
  ),

  // TABLE WRAPPER FOR OVERFLOW
  table: ({ children, ...props }) => (
    <div className="w-full overflow-x-auto my-4">
      <table className="w-full min-w-full divide-y divide-gray-200" {...props}>
        {children}
      </table>
    </div>
  ),

  // IMAGE
  img: ({ src, alt }) => (
    <Image
      src={src}
      alt={alt}
      className="my-3 rounded-lg"
    />
  ),

  // LINK (internal + external)
  a: ({ href, children }) => {
    const external = isExternalLink(href);

    const className =
      'text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:opacity-80 transition';

    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={className}
        >
          {children}
        </a>
      );
    }

    return (
      <RouterLink href={href} className={className}>
        {children}
      </RouterLink>
    );
  },

  // BLOCK CODE WRAPPER
  pre: ({ children }) => (
    <div className="my-4 overflow-x-auto rounded-lg bg-zinc-900 p-4 text-sm text-white">
      <pre className="whitespace-pre-wrap">{children}</pre>
    </div>
  ),

  // INLINE + BLOCK CODE
  code({ className, children }) {
    const isBlock = /language-(\w+)/.test(className || '');

    if (isBlock) {
      return <code className={className}>{children}</code>;
    }

    return (
      <code className="rounded bg-gray-200 px-1 py-0.5 text-sm dark:bg-gray-800">
        {children}
      </code>
    );
  },
};