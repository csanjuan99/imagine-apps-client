<script setup lang="ts">
import { ref } from 'vue'
import { FwbButton, FwbInput } from 'flowbite-vue'
import type { AxiosError } from 'axios'
import { useNotification } from '@kyvg/vue3-notification'
import { useAxios } from '@vueuse/integrations/useAxios'
import router from '@/router'


// composables
const { notify } = useNotification()

// data
const payload = ref({
  email: '',
  password: '',
  repeat_password: ''
})

// methods
const onRegister = async () => {
  try {
    await useAxios(`${import.meta.env.VITE_API_URL}/auth/register`, {
      method: 'POST',
      data: payload.value,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    await router.push('/login')
  } catch (e: AxiosError | any) {
    notify({
      type: 'error',
      title: 'Error',
      text: e.response?.data?.detail || 'Unkown error, please try again later.'
    })
  }
}
</script>

<template>
  <section
    class="bg-[url('https://flowbite.s3.amazonaws.com/blocks/marketing-ui/authentication/background.jpg')] bg-no-repeat bg-cover bg-center bg-gray-700 bg-blend-multiply bg-opacity-60">
    <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen pt:mt-0">
      <a href="#" class="inline-flex items-center mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        <img class="w-auto h-8 mr-2"
             src="https://assets-global.website-files.com/5ef9e7820240534a394d4b30/634dad4b9b56535c1555419b_Logo%20Imagine.webp"
             alt="logo">
      </a>
      <div class="w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800">
        <div class="p-6 space-y-4 md:space-y-6 lg:space-y-8 sm:p-8">
          <h2
            class="text-xl font-bold leading-tight tracking-tight text-center text-gray-900 md:text-2xl dark:text-white">
            Create your account
          </h2>
          <form
            class="space-y-4 md:space-y-6"
            @submit.prevent="onRegister">

            <FwbInput
              label="Your email"
              v-model="payload.email"
              type="email"
              name="email"
              id="email"
              class="text-gray-900
                     sm:text-sm rounded-lg focus:ring-primary-600
                     focus:border-primary-600 block w-full
                     dark:bg-gray-700 dark:border-gray-600
                     dark:placeholder-gray-400 dark:text-white"
              placeholder="name@company.com" required />
            <FwbInput
              label="Password"
              v-model="payload.password"
              type="password"
              name="password"
              id="password"
              placeholder="******"
              class="text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600
               focus:border-primary-600 block w-full dark:bg-gray-700
               dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              required />
            <FwbInput
              label="Confirm password"
              v-model="payload.repeat_password"
              type="password"
              name="confirm-password"
              id="confirm-password"
              placeholder="******"
              class="text-gray-900
                 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600
                 block w-full  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400
                 dark:text-white"
              required />
            <FwbButton
              title="Create an account"
              type="submit"
              class="w-full text-white bg-primary-600
                    hover:bg-primary-700 focus:ring-4
                    focus:outline-none focus:ring-primary-300
                    font-medium rounded-lg text-sm px-5 py-2.5
                    text-center dark:bg-primary-600 dark:hover:bg-primary-700
                     dark:focus:ring-primary-800 ease-in-out duration-150">
              Create an account
            </FwbButton>
            <p class="text-sm font-light text-center text-gray-500 dark:text-gray-300">
              <RouterLink
                to="/login"
                class="font-medium text-primary-600 hover:underline dark:text-primary-500">Already have an
                account?
              </RouterLink>
            </p>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
