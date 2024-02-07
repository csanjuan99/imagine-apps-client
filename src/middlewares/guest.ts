import { ref } from 'vue'
import router from '@/router'

export default async function Guest(to: any, from: any) {
  const accessToken = ref(localStorage.getItem('access_token'))
  if (to.meta.auth === 'guest' && accessToken.value) {
    await router.push({ name: 'home' })
  }
}
