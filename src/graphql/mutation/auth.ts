import { gql } from '@apollo/client'

export const REGISTER_MUTATION = gql`
  mutation CreateUser($input: UsersPermissionsRegisterInput!) {
    register(input: $input) {
      jwt
      user {
        email
        id
        documentId
        confirmed
        role {
          name
        }
        username
      }
    }
  }
`

export const LOGIN_MUTATION = gql`
  mutation SignIn($input: UsersPermissionsLoginInput!) {
    login(input: $input) {
      jwt
      user {
        id
        documentId
        email
      }
    }
  }
`
export const UPDATE_USER_MUTATION = gql`
  mutation UpdateUser($input: UsersPermissionsUpdateInput!) {
    updateUser(input: $input) {
      user {
        id
        documentId
        email
      }
    }
  }
`

export const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($documentId: ID!) {
    deleteUser(documentId: $documentId) {
      id
      documentId
      email
    }
  }
`
