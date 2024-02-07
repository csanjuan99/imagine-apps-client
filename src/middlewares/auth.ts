import { ref } from 'vue'
import { useAuth } from '@/composables/useAuth'

export default async function Auth(to: any, from: any) {
  const accessToken = ref(localStorage.getItem('access_token'))

  const auth = useAuth()

  if (!auth.loggedIn.value && to.path !== '/login') {
    return await auth.me()
  }

  if ((from.meta.auth === true || to.meta.auth === true) || accessToken.value) {
    return await auth.me()
  }
}
