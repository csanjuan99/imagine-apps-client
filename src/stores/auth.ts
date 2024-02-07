import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    loggedIn: false,
    user: null as any,
    busy: false
  }),

  actions: {
    setLoggedIn(loggedIn: boolean) {
      this.loggedIn = loggedIn
    },
    setUser(user: any) {
      this.user = user
    },
    setBusy(busy: boolean) {
      this.busy = busy
    }
  }
})
