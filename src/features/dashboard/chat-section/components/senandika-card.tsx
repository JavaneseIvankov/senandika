import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}  from "@/shared/components/ui/card"

export default function SenandikaCard() {
  return (
    <Card>
      <CardHeader className="gap-0">
        <h1 className="text-[18px]">Senandika</h1>
        <p className="text-[12px]">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Eveniet, quisquam.</p>
      </CardHeader>
    </Card>
  )
}