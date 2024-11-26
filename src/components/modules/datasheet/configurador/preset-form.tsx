'use client'
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DialogDescription, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useConfigurator } from "@/hooks/use-configurator/use-configurator";
import { Label } from "@radix-ui/react-label";
import { Trash, X } from "lucide-react";
import { TreeImagesContent } from "./tree-images-content";
import { FilteredTagInput } from "./filtered-tags-input";
import { getProduct } from "@/data/use-cases/get-product";

export function PresetForm({ ...props }) {
  const {
    register,
    setValue,
    append,
    remove,
    handleSubmit,
    handleUpperCaseInput,
    onSubmit,
    fields,
    updatedFields,
    setUpdatedFields,
    standardTags,
    handleAddProductTag,
    handleRemoveTag,
    localStandardTags,
    newTag,
    setNewTag,
    handleAddTag,
    watchedFields,
    productTags,
    localProductTags,
    newProductTag,
    setNewProductTag,
    isChanged,
  } = useConfigurator({ ...props })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogDescription />
      <DialogTitle className="mt-5 flex items-center w-full gap-1">
        <div className='flex flex-col space-y-1 ml-3 mr-1' >
          <Label className='text-sm' htmlFor="name">Nome</Label>
          <Input
            id="name"
            className="w-auto flex-grow-0"
            {...register('name')}
            onInput={handleUpperCaseInput}
            style={{ width: `${Math.max(10, watchedFields.name?.length || 0) + 1}ch` }}
          />
        </div>
        <div className='flex flex-col space-y-1' >
          <Label className='text-sm' htmlFor="description">Descrição</Label>
          <Input
            id="description"
            className="min-w-[45rem] flex-grow"
            {...register('description')}
            onInput={handleUpperCaseInput}
          />
        </div>
      </DialogTitle>
      <ScrollArea className='h-[600px] overflow-x-auto px-3 py-3' >
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label className="font-semibold text-sm" >Conteúdo</Label>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Código</TableHead>
                  <TableHead className="w-[80px]">Quantidade</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((item, index) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Input
                        {...register(`content.${index}.code`)}
                        onInput={handleUpperCaseInput}
                        onBlur={async (e) => {
                          const upperCaseValue = e.target.value.toUpperCase();
                          const product = await getProduct(upperCaseValue);
                          if (product) {
                            setValue(`content.${index}.quantity`, '1');
                            setValue(`content.${index}.description`, product.description);
                          }
                        }}
                        className="w-[200px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        {...register(`content.${index}.quantity`)}
                        type="number"
                        className="w-full"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        {...register(`content.${index}.description`)}
                        className="min-w-[490px]"
                        onInput={handleUpperCaseInput}
                      />
                    </TableCell>
                    <TableCell className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="bg-transparent text-red-500"
                      >
                        <Trash size={20} />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={() =>
                  append({ code: '', quantity: '0', description: '' })
                }
              >
                Novo Conteúdo
              </Button>
            </div>
          </div>
          <div className="grid gap-2">
            <Label className="font-semibold text-sm">Anexos</Label>
            <TreeImagesContent preset={updatedFields} setPreset={setUpdatedFields} />
          </div>
          <div className='grid gap-2' >
            {/* <Tabs value={activeTab} onValueChange={setActiveTab} className='space-x-3' >
              <Label>Tags Criadas</Label>
              <TabsList>
                <TabsTrigger value="fluxo" className="w-full">Fluxo</TabsTrigger>
                <TabsTrigger value="produto" className="w-full">Produto</TabsTrigger>
              </TabsList>
              <TabsContent value="fluxo">
                <MultiSelect
                  options={flowTags}
                  onValueChange={(value: any) => {
                    const newTags = Array.isArray(value) ? value : [value];
                    const uniqueTags = Array.from(new Set([...(watchedFields.tags || []), ...newTags]));
                    setValue('tags', uniqueTags);
                  }}
                  placeholder="Selecione"
                  variant="secondary"
                />
              </TabsContent>
              <TabsContent value="produto">
                <MultiSelect
                  options={_productTags}
                  onValueChange={(value: any) => {
                    const newTags = Array.isArray(value) ? value : [value];
                    const uniqueTags = Array.from(new Set([...(watchedFields.productTags || []), ...newTags]));
                    setValue('productTags', uniqueTags);
                  }}
                  placeholder="Selecione"
                  variant="secondary"
                />
              </TabsContent>
            </Tabs> */}
          </div>
          <div className="grid gap-2">
            <Label className="font-semibold text-sm" >Tags Padrão</Label>
            <div className="flex flex-wrap gap-2">
              {standardTags?.map((tag, index) => (
                <Badge className="bg-cyan-400" key={index} variant="secondary">
                  {tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0 text-smd-500"
                    onClick={() => handleRemoveTag(tag, 'standard')}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <FilteredTagInput
              labelButton='Adicionar Tag'
              existingTags={localStandardTags}
              value={newTag}
              onChange={setNewTag}
              onAddTag={handleAddTag}
              onSelectTag={(tag) => {
                setValue('tags', [...(watchedFields.tags || []), tag])
                setNewTag('')
              }}
              placeholder="Nova tag"
            />
          </div>
          <div className="grid gap-2">
            <Label className="font-semibold text-sm" >Tags de Fluxo de Produto</Label>
            <div className="flex flex-wrap gap-2">
              {productTags?.map((tag, index) => (
                <Badge className="bg-emerald-300" key={index} variant="secondary">
                  {`${tag}TON/H`}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="ml-2 h-auto p-0 text-smd-500 "
                    onClick={() => {
                      handleRemoveTag(tag, 'product');
                      if (watchedFields.tags?.includes(tag)) {
                        handleRemoveTag(tag, 'standard');
                      }
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
            <FilteredTagInput
              labelButton='Adicionar Tag de Produto'
              existingTags={localProductTags}
              value={newProductTag}
              onChange={setNewProductTag}
              onAddTag={handleAddProductTag}
              onSelectTag={(tag) => {
                setValue('productTags', [...(watchedFields.productTags || []), tag])
                setNewProductTag('')
              }}
              placeholder="Nova Tag de Produto (ex: PRODUTO=QUANTIDADE)"
              validateTag={(tag) => /^[A-Z]+=[0-9]+$/.test(tag)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" disabled={!isChanged}>
            Salvar Alterações
          </Button>
        </DialogFooter>
      </ScrollArea>
    </form>
  )
}