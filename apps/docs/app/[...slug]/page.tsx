import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { DocsShell } from "../../components/docs-shell";
import { docsPages, getPageBySlug } from "../../lib/docs";

interface DocsPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return docsPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: DocsPageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    return {};
  }

  return {
    title: page.title,
    description: page.description,
  };
}

export default async function DocsPage({ params }: DocsPageProps) {
  const { slug } = await params;
  const page = getPageBySlug(slug);

  if (!page) {
    notFound();
  }

  return (
    <DocsShell
      title={page.title}
      description={page.description}
      headings={page.headings}
      pathname={`/${slug.join("/")}`}
    >
      {page.content}
    </DocsShell>
  );
}
