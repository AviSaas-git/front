import { CourbeReferenceEditor } from "@/components/especes/CourbeReferenceEditor"
type Props = { params: Promise<{ id: string }> }

export default async function CourbeReferencePage({ params }: Props) {
  const { id } = await params
  return <CourbeReferenceEditor especeId={id} />
}