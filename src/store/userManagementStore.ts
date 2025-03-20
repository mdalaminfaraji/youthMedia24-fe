/* eslint-disable @typescript-eslint/no-explicit-any */
import { GET_ALL_USERS } from '@/graphql/queries/auth'
import { 
  UPDATE_USER_MUTATION, 
  DELETE_USER_MUTATION 
} from '@/graphql/mutation/auth'
import apolloClient from '@/lib/apolloClient'
import { create } from 'zustand'

export interface User {
  documentId: string
  username: string
  email: string
  phoneNumber: string
  blocked: boolean
  confirmed: boolean
  role: {
    documentId: string
    name: string
  }
}

interface UserInput {
  username: string
  email: string
  phoneNumber: string
  blocked: boolean
}

interface UserStore {
  users: User[]
  selectedUser: User | null
  loading: boolean
  error: string | null
  fetchUsers: () => Promise<void>
  updateUser: (documentId: string, data: UserInput) => Promise<boolean>
  deleteUser: (documentId: string) => Promise<boolean>
  toggleBlockUser: (documentId: string, blocked: boolean) => Promise<boolean>
}

export const useUserStore = create<UserStore>((set) => ({
  users: [],
  selectedUser: null,
  loading: false,
  error: null,

  fetchUsers: async () => {
    try {
      set({ loading: true, error: null })
      const { data } = await apolloClient.query({
        query: GET_ALL_USERS,
        fetchPolicy: 'network-only',
      })
      set({ users: data.usersPermissionsUsers, loading: false })
    } catch (error: any) {
      set({ error: error.message, loading: false })
      return Promise.reject(error)
    }
  },

  updateUser: async (documentId: string, data: UserInput) => {
    try {
      set({ loading: true, error: null })
      await apolloClient.mutate({
        mutation: UPDATE_USER_MUTATION,
        variables: {
          input: {
            documentId,
            ...data,
          },
        },
      })
      // Refresh users list after update
      const store = useUserStore.getState()
      await store.fetchUsers()
      return true
    } catch (error: any) {
      set({ error: error.message, loading: false })
      return false
    }
  },

  deleteUser: async (documentId: string) => {
    try {
      set({ loading: true, error: null })
      await apolloClient.mutate({
        mutation: DELETE_USER_MUTATION,
        variables: {
          documentId,
        },
      })
      // Refresh users list after deletion
      const store = useUserStore.getState()
      await store.fetchUsers()
      return true
    } catch (error: any) {
      set({ error: error.message, loading: false })
      return false
    }
  },

  toggleBlockUser: async (documentId: string, blocked: boolean) => {
    try {
      set({ loading: true, error: null })
      await apolloClient.mutate({
        mutation: UPDATE_USER_MUTATION,
        variables: {
          input: {
            documentId,
            blocked,
          },
        },
      })
      // Refresh users list after toggle
      const store = useUserStore.getState()
      await store.fetchUsers()
      return true
    } catch (error: any) {
      set({ error: error.message, loading: false })
      return false
    }
  },
}))
