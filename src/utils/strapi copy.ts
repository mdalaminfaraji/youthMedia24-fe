/* eslint-disable @typescript-eslint/no-explicit-any */
export const authenticateWithStrapi = async (userData: {
  email: string
  uid: string
  username: string
}) => {
  try {
    // First check if user exists by email and get their data
    const checkResponse = await fetch(
      `http://localhost:1337/api/users?filters[email][$eq]=${encodeURIComponent(
        userData.email
      )}&populate=role`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const checkData = await checkResponse.json()
    console.log('Existing user data:', checkData)

    if (checkData && checkData.length > 0) {
      const existingUser = checkData[0]
      console.log('Found existing user:', existingUser)

      // If the user exists but doesn't have firebaseUID, update it
      if (!existingUser.firebaseUID) {
        const updateResponse = await fetch(
          `http://localhost:1337/api/users/${existingUser.id}`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              firebaseUID: userData.uid,
              provider: 'firebase',
            }),
          }
        )

        if (!updateResponse.ok) {
          console.error('Failed to update user with Firebase UID')
        }
      }

      // Try to login
      const loginResponse = await fetch(
        'http://localhost:1337/api/auth/local',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identifier: userData.email,
            password: userData.uid,
          }),
        }
      )

      const loginData = await loginResponse.json()
      console.log('Login response:', loginData)

      if (loginResponse.ok) {
        return loginData
      }

      // If login fails, try to reset password and login again
      console.log('Login failed, updating password...')
      const resetResponse = await fetch(
        `http://localhost:1337/api/users/${existingUser.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            password: userData.uid,
          }),
        }
      )

      if (resetResponse.ok) {
        // Try login again with new password
        const retryResponse = await fetch(
          'http://localhost:1337/api/auth/local',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              identifier: userData.email,
              password: userData.uid,
            }),
          }
        )

        const retryData = await retryResponse.json()
        if (retryResponse.ok) {
          return retryData
        }
      }

      throw new Error('Failed to authenticate user')
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
    const registerResponse = await fetch(
      'http://localhost:1337/api/auth/local/register',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userData.email,
          username: `${userData.email.split('@')[0]}_${Date.now()}`,
          password: userData.uid,
        }),
      }
    )

    const registerData = await registerResponse.json()
    if (!registerResponse.ok) {
      console.error('Registration error:', registerData)
      throw new Error(registerData.error?.message || 'Registration failed')
    }

    // Update with additional fields
    const updateResponse = await fetch(
      `http://localhost:1337/api/users/${registerData.user.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${registerData.jwt}`,
        },
        body: JSON.stringify({
          firebaseUID: userData.uid,
          provider: 'firebase',
          role: authenticatedRole.id,
        }),
      }
    )

    const updateData = await updateResponse.json()
    if (!updateResponse.ok) {
      console.error('Update error:', updateData)
      throw new Error(updateData.error?.message || 'Failed to update user')
    }

    return {
      jwt: registerData.jwt,
      user: updateData,
    }
  } catch (error) {
    console.error('Error in Strapi authentication:', error)
    throw error
  }
}
