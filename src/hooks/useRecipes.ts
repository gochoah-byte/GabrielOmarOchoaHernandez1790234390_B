import { keepPreviousData, useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { getErrorMessage } from '../utils/errorHandler'
import { recipeService } from '../services/recipeService'
import type { ListFilters } from '../types'
export function useRecipes(filters: ListFilters) {
  return useQuery({queryKey:['recipes',filters.page,filters.q],queryFn:()=>recipeService.list(filters),placeholderData:keepPreviousData})
}
export function useRecipe(id: number) {
  return useQuery({queryKey:['recipe',id],queryFn:()=>recipeService.getById(id),retry:false})
}
export function useCreateRecipe() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: recipeService.create,
    onSuccess: () => {
      toast.success('Receta creada. La API simula el guardado.')
      void client.invalidateQueries({ queryKey: ['recipes'] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
export function useDeleteRecipe() {
  const client = useQueryClient()
  return useMutation({
    mutationFn: recipeService.remove,
    onSuccess: () => {
      toast.success('Receta eliminada. La API simula la eliminación.')
      void client.invalidateQueries({ queryKey: ['recipes'] })
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  })
}
