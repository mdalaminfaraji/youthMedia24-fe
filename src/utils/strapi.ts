import { LOGIN_MUTATION, REGISTER_MUTATION } from '@/graphql/mutation/auth'
import apolloClient from '@/lib/apolloClient'

/* eslint-disable @typescript-eslint/no-explicit-any */
export const authenticateWithStrapi = async (userData: {
  email: string
  uid: string
  username: string
}) => {
  try {
    // First check if user exists by email
    const checkResponse = await fetch(
      `http://localhost:1337/api/users?filters[email][$eq]=${encodeURIComponent(
        userData.email
      )}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const checkData = await checkResponse.json()
    const userExists = checkData.length > 0

    if (userExists) {
      // User exists, try to login
      console.log(userData)

      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          input: {
            identifier: userData.email,
            password: userData.uid,
            provider: 'local', // Ensure provider is 'local'
          },
        },
      })

      // const loginResponse = await fetch(
      //   'http://localhost:1337/api/auth/local',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       identifier: userData.email,
      //       password: userData.uid,
      //       provider: 'local',
      //     }),
      //   }
      // )

      // const loginData = await loginResponse.json()
      if (data) {
        console.log(data)
        return data?.login
      }
      throw new Error(data.error?.message || 'Login failed')
    }

    // User doesn't exist, proceed with registration
    console.log('User not found, creating new account')

    // Get the authenticated role id
    const roleResponse = await fetch(
      'http://localhost:1337/api/users-permissions/roles'
    )
    const rolesData = await roleResponse.json()
    const authenticatedRole = rolesData.roles.find(
      (role: any) => role.type === 'authenticated'
    )

    if (!authenticatedRole) {
      throw new Error('Could not find authenticated role')
    }
    console.log(userData)
    // Register the user
    const { data } = await apolloClient.mutate({
      mutation: REGISTER_MUTATION,
      variables: {
        input: {
          email: userData.email,
          password: userData.uid,
          username: `${userData.email.split('@')[0]}_${Date.now()}`,
        },
      },
    })

    if (data) {
      return data?.register
    }
    throw new Error(data.error?.message || 'Registration failed')
    // const registerResponse = await fetch(
    //   'http://localhost:1337/api/auth/local/register',
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       email: userData.email,
    //       username: `${userData.email.split('@')[0]}_${Date.now()}`,
    //       password: userData.uid,
    //     }),
    //   }
    // )

    // const registerData = await registerResponse.json()
    // if (!registerResponse.ok) {
    //   console.error('Registration error:', registerData)
    //   throw new Error(registerData.error?.message || 'Registration failed')
    // }

    // // Update with additional fields
    // const updateResponse = await fetch(
    //   `http://localhost:1337/api/users/${registerData.user.id}`,
    //   {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization: `Bearer ${registerData.jwt}`,
    //     },
    //     body: JSON.stringify({
    //       firebaseUID: userData.uid,
    //       provider: 'firebase',
    //       role: authenticatedRole.id,
    //     }),
    //   }
    // )

    // const updateData = await updateResponse.json()
    // if (!updateResponse.ok) {
    //   console.error('Update error:', updateData)
    //   throw new Error(updateData.error?.message || 'Failed to update user')
    // }

    // return {
    //   jwt: registerData.jwt,
    //   user: updateData,
    // }
  } catch (error) {
    console.error('Error in Strapi authentication:', error)
    throw error
  }
}
