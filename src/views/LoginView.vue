<script setup lang="ts">
import { FwbButton, FwbInput } from 'flowbite-vue'
import { ref } from 'vue'
import { useAxios } from '@vueuse/integrations/useAxios'
import { useNotification } from '@kyvg/vue3-notification'
import type { AxiosError } from 'axios'
import { useRouter } from 'vue-router'

// composable
const { notify } = useNotification()
const router = useRouter()

// data
const email = ref('')
const password = ref('')

// methods
const onLogin = async () => {
  const payload = new FormData()
  payload.append('username', email.value)
  payload.append('password', password.value)
  try {
    const { data } = await useAxios(`${import.meta.env.VITE_API_URL}/auth/login`, {
      method: 'POST',
      data: payload,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    const { access_token } = data.value
    localStorage.setItem('access_token', `${access_token}`)
    await router.push('/')
  } catch (e: AxiosError | any) {
    console.log(e)
    notify({
      type: 'error',
      title: 'Error',
      text: e.response?.data?.detail || 'Unkown error, please try again later.'
    })
  }
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 h-screen flex justify-center items-center">
    <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-20 lg:py-16 lg:grid-cols-12">
      <div class="w-full place-self-center lg:col-span-6">
        <div class="p-6 mx-auto bg-white rounded-lg shadow dark:bg-gray-800 sm:max-w-xl sm:p-8">
          <a href="#" class="inline-flex items-center mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            <img class="w-auto h-8 mr-2"
                 src="https://assets-global.website-files.com/5ef9e7820240534a394d4b30/634dad4b9b56535c1555419b_Logo%20Imagine.webp"
                 alt="logo">
          </a>
          <h1 class="mb-2 text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">Bienvenid@ de
            vuelta</h1>
          <div class="text-sm font-light text-gray-500 dark:text-gray-300">
            Inicia sesion en segundos. No tienes cuenta?
            <RouterLink
              to="/register"
              class="font-medium text-primary-600 hover:underline dark:text-primary-500">Registrate
            </RouterLink>
          </div>
          <form class="mt-4 space-y-6 sm:mt-6" @submit.prevent="onLogin">
            <div class="grid gap-6 sm:grid-cols-2">
              <fwb-input
                required
                size="lg"
                label="Tu correo electrónico *"
                type="email"
                placeholder="john@doe.com"
                title="Correo electrónico"
                id="email"
                v-model="email"
              />
              <fwb-input
                required
                size="lg"
                label="Tu contraseña *"
                title="Contraseña"
                placeholder="*********"
                type="password"
                id="password"
                v-model="password"
              />
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-start">
                <div class="flex items-center h-5">
                  <input
                    id="remember"
                    aria-describedby="remember"
                    type="checkbox"
                    class="w-4 h-4 border border-gray-300 rounded bg-gray-50
                    focus:ring-3 focus:ring-primary-300 dark:bg-gray-700
                    dark:border-gray-600 dark:focus:ring-primary-600
                    dark:ring-offset-gray-800"
                  >
                </div>
                <div class="ml-3 text-sm">
                  <label
                    for="remember"
                    class="text-gray-500 dark:text-gray-300">Recuerdame</label>
                </div>
              </div>
              <RouterLink
                to="/forgot-password"
                class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
                Olvidaste tu contraseña?
              </RouterLink>
            </div>
            <FwbButton
              type="submit"
              class="w-full text-white bg-primary-500
              hover:bg-primary-600 focus:ring-4
              focus:outline-none focus:ring-primary-300
              font-medium rounded-lg text-sm px-5 py-2.5
               text-center dark:bg-primary-600 dark:hover:bg-primary-600
               dark:focus:ring-primary-800 ease-in-out duration-150">
              Inicia sesion en tu cuenta
            </FwbButton>
          </form>
        </div>
      </div>
      <div class="mr-auto place-self-center lg:col-span-6">
        <img
          class="hidden mx-auto lg:flex"
          src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/illustration.svg"
          alt="illustration"
        >
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
