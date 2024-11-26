import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DATASHEET_BASE_URL } from "@/config/env/datasheet-base-url"
import { datasheetAPI } from "@/lib/fetch/datasheet-api"
import { Link } from "lucide-react"
import { Fragment, ReactNode, useEffect, useState } from 'react'
import { useFormContext } from "react-hook-form"
import { toast } from 'sonner'

interface Item {
  code: string
  quantity: number
  description: string
}

interface ItemListCardProps {
  itemId: string
  items?: Item[]
  images?: string[]
  trigger: ReactNode,
}

export default function ItemListCard({ itemId, trigger }: ItemListCardProps) {
  const { getValues, setValue } = useFormContext()
  const [items, setItems] = useState<Item[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [open, setOpen] = useState(false)

  const getItems = async () => {
    const response = await datasheetAPI(`/v1/preset/${itemId}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
      }
    })
    const { items, images } = await response.json();

    if (items.length === 0 && images.length === 0) return toast.error('Não há itens vinculados a este preset.')

    const attach = images.map((img: string) => `${DATASHEET_BASE_URL}/presets/${img}`)

    setItems(items)
    setImagePreviews(attach)
  }

  async function onHandleLinkItemsPresets() {
    const currentItems = getValues().items || []
    const currentImages = getValues().images || []
    const newItems = items.filter(newItem =>
      !currentItems.some(existingItem => existingItem.code === newItem.code)
    )


    const updatedItems = newItems.map((item: any) => {
      if (!item.hasOwnProperty('item')) {
        return { ...item, item: '' };
      }
      return item;
    });

    if (newItems.length > 0) {
      setValue('items', [...currentItems, ...updatedItems])
      setValue('images', [...currentImages, ...imagePreviews])
      toast.success('Itens adicionados com sucesso.')
    } else {
      toast.info('Nenhum novo item para adicionar.')
    }
    setOpen(false)
  }

  useEffect(() => {
    if (itemId) {
      getItems()
    }
  }, [itemId])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="w-full">
          <CardContent>
            <Tabs>
              <TabsList className="w-full">
                <TabsTrigger value="items" className="w-full">Items</TabsTrigger>
                <TabsTrigger value="images" className="w-full">Imagens</TabsTrigger>
              </TabsList>
              <TabsContent defaultValue="items" value="items" >
                <div className="w-full">
                  {items && items.length > 0 ? (
                    <div className="overflow-x-auto">
                      <ScrollArea className="h-[400px] rounded-md border">
                        <Table className="w-full">
                          <TableHeader className="sticky top-0 bg-background">
                            <TableRow>
                              <TableHead className="w-[33%]">CÓDIGO</TableHead>
                              <TableHead className="w-[33%] text-center">QUANTIDADE</TableHead>
                              <TableHead className="w-[33%]">DESCRIÇÃO</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {items.map((item) => (
                              <TableRow key={item.code} className="hover:bg-muted/50">
                                <TableCell className="font-medium">{item.code}</TableCell>
                                <TableCell className="text-center">
                                  <Badge variant="secondary">{item.quantity}</Badge>
                                </TableCell>
                                <TableCell>{item.description}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </ScrollArea>
                    </div>
                  ) : (
                    <p className="text-center">Não há itens.</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="images">
                <div className="pl-4">
                  {imagePreviews.length > 0 ? (
                    <Fragment>
                      <div className="grid grid-cols-2 gap-2">
                        {imagePreviews.map((preview, index) => (
                          <img
                            key={index}
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            width={150}
                            height={150}
                            className="rounded-md object-cover"
                          />
                        ))}
                      </div>
                    </Fragment>
                  ) : (
                    <p className="text-center">Não há imagens.</p>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={onHandleLinkItemsPresets}>
              <Link className="mr-2 h-4 w-4" />
              Vincular
            </Button>
          </CardFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}