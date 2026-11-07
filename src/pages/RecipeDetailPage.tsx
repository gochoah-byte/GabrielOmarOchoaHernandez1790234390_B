import axios from 'axios'
import toast from 'react-hot-toast'
import { fichaText } from '../utils/ficha'
import { Link, useParams } from 'react-router-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { useRecipe } from '../hooks/useRecipes'
import { getErrorMessage } from '../utils/errorHandler'
import type { Recipe } from '../types'
function saveBlob(blob:Blob,filename:string) {
 const url = URL.createObjectURL(blob)
 const link = document.createElement('a')
 link.href=url
 link.download=filename
 document.body.appendChild(link)
 try { link.click() } finally {link.remove(); window.setTimeout(()=>URL.revokeObjectURL(url),1000)}
}
async function downloadImage(item:Recipe) {
 try {
  const {data} = await axios.get<Blob>(item.image,{responseType:'blob'})
  saveBlob(data,'receta-'+item.id+'.webp')
 } catch(error) {toast.error(getErrorMessage(error))}
}
function downloadFicha(item:Recipe) {
 try { saveBlob(new Blob([fichaText(item)],{type:'text/plain;charset=utf-8'}),'receta-'+item.id+'.txt') }
 catch(error) {toast.error(getErrorMessage(error))}
}

function RecipeDetailPage() {
  const { id } = useParams()
  const { data, isLoading, isError, error } = useRecipe(Number(id))

  return (
    <main className="mx-auto max-w-3xl p-4">
      <Link to="/recetas" className="text-sm font-medium text-brand-700 hover:underline">
        ← Volver al listado
      </Link>

      {isLoading && <p className="mt-6 text-slate-500" role="status">Cargando…</p>}

      
      {isError && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
      )}

      {data && (
          <article className="mt-4 grid gap-4 sm:grid-cols-2">
            <img src={data.image} alt={data.name} className="w-full rounded-xl bg-slate-100 object-cover" />
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-wide text-brand-700">{data.cuisine}</span>
              <h1 className="text-2xl font-bold">{data.name}</h1>
              <p className="text-sm">{data.difficulty} · Preparación {data.prepTimeMinutes} min · Cocción {data.cookTimeMinutes} min · {data.servings} porciones</p>
              <h2 className="font-semibold">Ingredientes</h2>
              <ul className="list-disc pl-5 text-sm text-slate-600">{data.ingredients.map((i) => <li key={i}>{i}</li>)}</ul>
              <h2 className="font-semibold">Instrucciones</h2>
              <ol className="list-decimal pl-5 text-sm text-slate-600">{data.instructions.map((i) => <li key={i}>{i}</li>)}</ol>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => downloadImage(data)}>Descargar imagen</Button>
                <Button variant="outline" onClick={() => downloadFicha(data)}>Descargar ficha</Button>
              </div>
            </div>
          </article>
      )}
    </main>
  )
}

export default RecipeDetailPage

