import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { useCreateRecipe } from '../hooks/useRecipes'

const schema = z.object({
  name: z.string().trim().min(3, 'El nombre necesita al menos 3 caracteres'),
  cuisine: z.string().trim().min(3, 'La cocina necesita al menos 3 caracteres'),
  prepTimeMinutes: z.number({ message: 'Escribe un número' }).int('Debe ser un entero').positive('Debe ser mayor que 0'),
})
type RecipeFields = z.infer<typeof schema>
interface Props { onClose: () => void }

function RecipeForm({ onClose }: Props) {
  const create = useCreateRecipe()
  const [image, setImage] = useState<File | undefined>()
  const [fileError, setFileError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview) }
  }, [preview])
  const elegirArchivo = (file: File | undefined) => {
    setImage(undefined)
    setPreview(null)
    setFileError(null)
    if (!file) return
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      setFileError('Solo se permiten imágenes JPG o PNG.')
      return
    }
    if (file.size > 1024 * 1024) {
      setFileError('La imagen no debe superar 1 MB.')
      return
    }
    setImage(file)
    setPreview(URL.createObjectURL(file))
  }
  const { register, handleSubmit, formState: { errors } } = useForm<RecipeFields>({ resolver: zodResolver(schema) })
  const submit = (values: RecipeFields) => {
    if (fileError) return
    const body = new FormData()
    body.append('name', values.name)
    body.append('cuisine', values.cuisine)
    body.append('prepTimeMinutes', String(values.prepTimeMinutes))
    if (image) body.append('image', image)
    create.mutate(body, { onSuccess: onClose })
  }
  const field = 'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm'
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="form-title" className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={handleSubmit(submit)} noValidate className="max-h-full w-full max-w-lg space-y-3 overflow-y-auto rounded-xl bg-white p-5">
        <h2 id="form-title" className="text-lg font-bold">Nueva receta</h2>
        <div>
          <label htmlFor="name" className="text-sm font-medium">Nombre</label>
          <input id="name" className={field} {...register('name')} />
          {errors.name && <p role="alert" className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
        <div>
          <label htmlFor="cuisine" className="text-sm font-medium">Cocina</label>
          <input id="cuisine" className={field} {...register('cuisine')} />
          {errors.cuisine && <p role="alert" className="mt-1 text-sm text-red-600">{errors.cuisine.message}</p>}
        </div>
        <div>
          <label htmlFor="prepTimeMinutes" className="text-sm font-medium">Tiempo de preparación (min)</label>
          <input id="prepTimeMinutes" type="number" className={field} {...register('prepTimeMinutes', { valueAsNumber: true })} />
          {errors.prepTimeMinutes && <p role="alert" className="mt-1 text-sm text-red-600">{errors.prepTimeMinutes.message}</p>}
        </div>
        <div>
          <label htmlFor="image" className="text-sm font-medium">Imagen (JPG o PNG, máx. 1 MB)</label>
          <input id="image" type="file" accept="image/jpeg,image/png" className="mt-1 block w-full text-sm" aria-invalid={!!fileError} aria-describedby={fileError ? "image-error" : undefined} onChange={e => elegirArchivo(e.target.files?.[0])} />
        </div>
        {fileError && <p id="image-error" role="alert" className="text-sm text-red-600">{fileError}</p>}
        {preview && <img src={preview} alt="Vista previa de la imagen elegida" className="h-24 max-w-full rounded-lg object-contain" />}
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={create.isPending}>Cancelar</Button>
          <Button type="submit" disabled={create.isPending || !!fileError}>{create.isPending ? 'Guardando…' : 'Guardar'}</Button>
        </div>
      </form>
    </div>
  )
}
export default RecipeForm
