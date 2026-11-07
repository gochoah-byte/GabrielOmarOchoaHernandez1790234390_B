import { api } from './api'
import type { Recipe, ListFilters, RecipesResponse } from '../types'

export const PAGE_SIZE = 8

export const recipeService = {
  list: async ({ page, q }: ListFilters): Promise<RecipesResponse> => {
    const {data} = await api.get<RecipesResponse>(q ? '/auth/recipes/search' : '/auth/recipes', {params:{limit:PAGE_SIZE,skip:(page-1)*PAGE_SIZE,...(q ? {q} : {})}})
    return data
  },
  getById: async (id: number): Promise<Recipe> => {
    const {data} = await api.get<Recipe>('/auth/recipes/'+id)
    return data
  },
  create: async (body: FormData): Promise<Recipe> => {
    const { data } = await api.post<Recipe>('/recipes/add', body)
    return data
  },
  remove: async (id: number): Promise<Recipe> => {
    const { data } = await api.delete<Recipe>('/recipes/' + id)
    return data
  },
}


