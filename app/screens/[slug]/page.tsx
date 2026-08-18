import { notFound } from "next/navigation"
import { SCREENS } from "@/lib/screen-registry"
import { SCREEN_COMPONENTS } from "@/components/screen-pages"

export function generateStaticParams() {
  return SCREENS.map((s) => ({ slug: s.slug }))
}

export default async function ScreenSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const Component = SCREEN_COMPONENTS[slug]
  if (!Component) notFound()
  return <Component />
}
