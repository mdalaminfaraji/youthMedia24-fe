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
