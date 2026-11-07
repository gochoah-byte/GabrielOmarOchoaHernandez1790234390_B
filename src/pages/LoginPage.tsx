import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '../services/authService'
import { useAuthStore } from '../store/authStore'
import { getErrorMessage } from '../utils/errorHandler'
const schema = z.object({username:z.string().trim().min(1,'Ingresa tu usuario'),password:z.string().min(1,'Ingresa tu contraseña')})
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
function LoginPage() {
  const field =
    'mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus-visible:outline-2 focus-visible:outline-brand-600'
  const [serverError,setServerError] = useState<string|null>(null)
  const navigate = useNavigate()
  const client = useQueryClient()
  const token = useAuthStore(s=>s.accessToken)
  const setSession = useAuthStore(s=>s.setSession)
  const {register,handleSubmit,formState:{errors,isSubmitting}} = useForm<z.infer<typeof schema>>({resolver:zodResolver(schema)})
  const submit = async (values:z.infer<typeof schema>) => {
   setServerError(null)
   try {
    const session = await authService.login(values.username,values.password)
    client.clear()
    setSession(session)
    navigate('/recetas',{replace:true})
   } catch(error) {setServerError(getErrorMessage(error))}
  }
  if(token) return <Navigate to="/recetas" replace />

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-6">
      <h1 className="text-2xl font-bold text-slate-900">Iniciar sesión</h1>
      <form onSubmit={handleSubmit(submit)} className="mt-4 space-y-3" noValidate>
        <div>
          <label htmlFor="username" className="text-sm font-medium">Usuario</label>
          <input id="username" autoComplete="username" className={field} {...register('username')} />
          {errors.username && <p role="alert" className="text-sm text-red-600">{errors.username.message}</p>}
        </div>
        <div>
          <label htmlFor="password" className="text-sm font-medium">Contraseña</label>
          <input id="password" type="password" autoComplete="current-password" className={field} {...register('password')} />
          {errors.password && <p role="alert" className="text-sm text-red-600">{errors.password.message}</p>}
        </div>
        {serverError && (
          <Alert variant="destructive">
            <AlertDescription>{serverError}</AlertDescription>
          </Alert>
        )}
        <Button type="submit" className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Ingresando…' : 'Ingresar'}</Button>
      </form>
    </main>
  )
}

export default LoginPage

