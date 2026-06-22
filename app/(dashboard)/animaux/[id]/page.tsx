import { AnimalDetailShell } from "@/components/animaux/AnimalDetailShell"

type Props = { params: Promise<{ id: string }> }

export default async function AnimalDetailPage({ params }: Props) { 
  const { id } = await params
  return <AnimalDetailShell animalId={id} />
}