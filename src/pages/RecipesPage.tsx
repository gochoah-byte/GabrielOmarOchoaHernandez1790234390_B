import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import Pagination from '../components/Pagination'
import RecipeCard from '../components/RecipeCard'
import RecipeForm from '../components/RecipeForm'
import { useRecipes, useDeleteRecipe } from '../hooks/useRecipes'
import { PAGE_SIZE } from '../services/recipeService'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../utils/errorHandler'
function parsePage(raw: string | null): number {
  const page = Number(raw)
  return raw && /^\d+$/.test(raw) && Number.isSafeInteger(page) && page >= 1 ? page : 1
}

function RecipesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePage(searchParams.get('page'))
  const q = searchParams.get('q') ?? ''
  const [text, setText] = useState(q)
  const [showForm, setShowForm] = useState(false)
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const { data, isLoading, isError, error, refetch, isFetching } = useRecipes({ page, q })
  const remove = useDeleteRecipe()


  const search = (event: React.FormEvent) => {
    event.preventDefault()
    setSearchParams(text.trim() ? {q:text.trim()} : {})
  }

  const changePage = (n: number) => {
    setSearchParams(previous => {
      const next = new URLSearchParams(previous)
      next.set('page',String(n))
      return next
    })
  }

  const onDelete = (item: { id: number; name: string }) => {
    if (remove.isPending) return
    if (window.confirm(`¿Eliminar la receta "${item.name}"?`)) remove.mutate(item.id)
  }

  const salir = () => {
    logout()
    navigate('/login',{replace:true})
  }

  const totalPages = data ? Math.max(1, Math.ceil(data.total / PAGE_SIZE)) : 1

  return (
    <>
      <header className="border-b border-slate-200 bg-brand-800 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="text-lg font-bold">Catálogo de recetas</span>
          <div className="flex items-center gap-3 text-sm">
            {user && <span className="hidden sm:inline">{user.firstName} {user.lastName}</span>}
            <Button variant="secondary" size="sm" onClick={salir}>Cerrar sesión</Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4">
        <form onSubmit={search} className="flex flex-col gap-3 sm:flex-row sm:items-end">
          <div className="flex-1">
            <label htmlFor="q" className="text-sm font-medium">Buscar</label>
            <input id="q" type="search" value={text} onChange={(e) => setText(e.target.value)} className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
          </div>
          <Button type="submit" variant="outline">Buscar</Button>
          <Button type="button" onClick={() => setShowForm(true)}>Nueva receta</Button>
        </form>

        {isLoading && <p className="mt-8 text-center text-slate-500" role="status">Cargando…</p>}

        
        {isError && (
          <Alert variant="destructive" className="mt-6">
            <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            <Button type="button" variant="outline" disabled={isFetching} onClick={()=>void refetch()}>Reintentar</Button>
          </Alert>
        )}

        {data && data.recipes.length === 0 && (
          <p className="mt-8 text-center text-slate-500">No hay resultados para la búsqueda.</p>
        )}

        {data && data.recipes.length > 0 && (
          <>
            <p className="mt-4 text-sm text-slate-500">{data.total} resultados</p>
            
            <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.recipes.map((item) => (
                <RecipeCard key={item.id} item={item} onDelete={onDelete} />
              ))}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={changePage} />
          </>
        )}
      </main>

      {showForm && <RecipeForm onClose={() => setShowForm(false)} />}
    </>
  )
}

export default RecipesPage


