import { useFetch } from '@vueuse/core'
import { useAuthStore } from '@/stores/auth'
import { computed, ref } from 'vue'
import router from '@/router'

export const useAuth = () => {

  const authStore = useAuthStore()
  const access_token = ref(localStorage.getItem('access_token'))


  const loggedIn = computed(() => authStore.loggedIn)
  const user = computed(() => authStore.user)
  const busy = computed(() => authStore.busy)


  const me = async () => {
    const { data, error } = await useFetch<any>(`${import.meta.env.VITE_API_URL}/auth/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token.value}`
      }
    })
    if (error.value || !data.value) {
      return await logout()
    }
    const user = data.value
    authStore.setUser(JSON.parse(user))
    authStore.setLoggedIn(true)
    authStore.setBusy(false)
  }

  const logout = async () => {
    access_token.value = null
    localStorage.removeItem('access_token')
    authStore.setLoggedIn(false)
    authStore.setUser(null)
    authStore.setBusy(false)
    await router.push('/login')
  }

  return {
    loggedIn,
    user,
    me,
    busy
  }
}
