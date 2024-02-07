<script setup lang="ts">
import { useAuth } from '@/composables/useAuth'
import { onMounted, type Ref, ref } from 'vue'
import { type AxiosError } from 'axios'
import { useAxios } from '@vueuse/integrations/useAxios'
import { useNotification } from '@kyvg/vue3-notification'
import { FwbBreadcrumb, FwbBreadcrumbItem, FwbButton, FwbInput, FwbModal, FwbTextarea } from 'flowbite-vue'
import draggable from 'vuedraggable'


// composable
const { user } = useAuth()
const { notify } = useNotification()

// data
const tasks = ref([])
const toDo: Ref<any> = ref([])
const done: Ref<any> = ref([])
const isCreating = ref(false)
const task = ref({
  title: '',
  description: ''
})

// methods
const onChange = async (evt: any, status: string) => {
  if (status === 'completed') {
    for (const task of done.value) {
      if (!task.completed) {
        try {
          await useAxios(`${import.meta.env.VITE_API_URL}/tasks/${task.id}`, {
            method: 'PUT',
            data: {
              completed: true,
              title: task.title,
              description: task.description,
              user_id: user.value.id
            },
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          })
        } catch (e: AxiosError | any) {
          console.log(e)
          notify({
            type: 'error',
            title: 'Error',
            text: e.response?.data?.detail || 'Unkown error, please try again later.'
          })
        }
      }
    }
  } else {
    for (const task of toDo.value) {
      if (task.completed) {
        try {
          await useAxios(`${import.meta.env.VITE_API_URL}/tasks/${task.id}`, {
            method: 'PUT',
            data: {
              completed: false,
              title: task.title,
              description: task.description
            },
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('access_token')}`
            }
          })
        } catch (e: AxiosError | any) {
          console.log(e)
          notify({
            type: 'error',
            title: 'Error',
            text: e.response?.data?.detail || 'Unkown error, please try again later.'
          })
        }
      }
    }
  }
}

const onCreating = () => {
  isCreating.value = !isCreating.value
}

const onFetchTasks = async () => {
  try {
    const { data, error } = await useAxios(`${import.meta.env.VITE_API_URL}/tasks/${user.value.id}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    if (!data.value && error.value) return
    tasks.value = data.value
    tasks.value.forEach((task: any) => {
      if (task.completed) {
        done.value.push(task)
      } else {
        toDo.value.push(task)
      }
    })
  } catch (e: AxiosError | any) {
    toDo.value = []
    done.value = []
    notify({
      type: 'warning',
      title: 'Error',
      text: e.response?.data?.detail || 'Unkown error, please try again later.'
    })
  }
}

const onCreateTask = async () => {
  try {
    await useAxios(`${import.meta.env.VITE_API_URL}/tasks/${user.value.id}`, {
      method: 'POST',
      data: {
        title: task.value.title,
        description: task.value.description ?? ''
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    await onFetchTasks()
    isCreating.value = false
  } catch (e: AxiosError | any) {
    console.log(e)
    notify({
      type: 'error',
      title: 'Error',
      text: e.response?.data?.detail || 'Unkown error, please try again later.'
    })
  }
}

const onDeleteTask = async (id: Number) => {
  try {
    await useAxios(`${import.meta.env.VITE_API_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    await onFetchTasks()
  } catch (e: AxiosError | any) {
    notify({
      type: 'error',
      title: 'Error',
      text: e.response?.data?.detail || 'Unkown error, please try again later.'
    })
  }
}

// hooks
onMounted(async () => {
  await onFetchTasks()
})
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900 h-screen justify-center items-center flex flex-col gap-4">
    <fwb-breadcrumb>
      <fwb-breadcrumb-item home href="#">
        Home
      </fwb-breadcrumb-item>
      <fwb-breadcrumb-item href="#">
        Tasks
      </fwb-breadcrumb-item>
    </fwb-breadcrumb>
    <h1 class="font-body text-lg">
      Welcome, <b>{{ user?.email }}</b>!
    </h1>
    <div class="flex flex-col lg:flex-row gap-6 bg-white shadow rounded-lg py-5 px-10">
      <div class="w-96">
        <h3 class="text-lg font-semibold whitespace-nowrap">
          Tasks to do
        </h3>
        <span class="text-sm">
          Drag and drop to change status
        </span>
        <draggable
          class="p-4 rounded bg-gray-50"
          :list="toDo"
          group="people"
          @change="onChange($event, 'completed')"
          itemKey="name"
        >
          <template #item="{ element }">
            <div class="uppercase m-3 bg-gray-200 px-2 py-3 rounded-lg flex items-center justify-between">
              <span>
                {{ element.title }}
              </span>
              <FwbButton
                type="button"
                @click="onDeleteTask(element.id)"
                class="text-sm bg-red-500 hover:bg-red-600 ease-in-out duration-150">
                Delete
              </FwbButton>
            </div>
          </template>
        </draggable>
      </div>

      <div class="w-96">
        <h3 class="text-lg font-semibold whitespace-nowrap">
          Completed tasks
        </h3>
        <span class="text-sm">
          Drag and drop to change status
        </span>
        <draggable
          class="p-4 rounded bg-gray-50"
          :list="done"
          group="people"
          @change="onChange($event, 'not_completed')"
          itemKey="name"
        >
          <template #item="{ element }">
            <div class="uppercase m-3 bg-green-300 px-2 py-3 rounded-lg flex items-center justify-between">
              <span>
                {{ element.title }}
              </span>
              <FwbButton
                type="button"
                @click="onDeleteTask(element.id)"
                class="text-sm bg-red-500 hover:bg-red-600 ease-in-out duration-150">
                Delete
              </FwbButton>
            </div>
          </template>
        </draggable>
      </div>
    </div>
    <FwbButton
      @click="onCreating"
      size="lg"
      class="bg-primary-500 hover:bg-primary-600 ease-in-out duration-150">
      Create task
    </FwbButton>

    <!--  Create modal  -->
    <FwbModal
      v-if="isCreating"
      @close="onCreating">
      <template #header>
        <div class="flex items-center text-lg">
          <h2>
            Create task
          </h2>
        </div>
      </template>
      <template #body>
        <form @submit.prevent="onCreateTask" class="flex flex-col gap-4">
          <FwbInput
            label="Task name"
            required
            placeholder="Do something"
            v-model="task.title"
          />
          <FwbTextarea
            label="Task description"
            placeholder="Do something important!"
            v-model="task.description"
          />
          <FwbButton
            type="submit"
            class="bg-primary-500 hover:bg-primary-600 ease-in-out duration-150">
            Create task
          </FwbButton>
        </form>
      </template>
    </FwbModal>
  </section>
</template>
