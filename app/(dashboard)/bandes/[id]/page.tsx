import { BandeDetailShell } from "@/components/bandes/BandeDetailShell"

type Props = {
  params: Promise<{ id: string }>
}

export default async function BandeDetailPage({ params }: Props) {
  const { id } = await params
  return <BandeDetailShell bandeId={id} />
}