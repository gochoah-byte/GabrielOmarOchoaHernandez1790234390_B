import axios from 'axios'
export function getErrorMessage(error:unknown):string {
 if(axios.isAxiosError<{message?:string}>(error)) {
  if(!error.response) return 'Sin conexión con el servidor. Comprueba tu conexión e inténtalo de nuevo.'
  const {status,data} = error.response
  if(status===400) return data?.message || 'Los datos enviados no son válidos.'
  if(status===401) return 'La sesión venció o las credenciales son incorrectas.'
  if(status===403) return 'No tienes permiso para realizar esta acción.'
  if(status===404) return 'No se encontró la receta solicitada.'
  if(status>=500) return 'El servidor tiene problemas. Inténtalo más tarde.'
 }
 return 'Ocurrió un error. Inténtalo nuevamente.'
}
