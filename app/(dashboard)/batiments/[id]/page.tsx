import { BatimentDetailPage } from "@/components/batiments/BatimentDetailPage"

type Props = { params: Promise<{ id: string }> }

export default async function Page({ params }: Props) {
  const { id } = await params
  return <BatimentDetailPage batimentId={id} />
}