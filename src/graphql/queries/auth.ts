import { gql } from '@apollo/client'

export const GET_ALL_USERS = gql`
  query getAllUsers {
    usersPermissionsUsers {
      email
      blocked
      documentId
      username
      confirmed
      role {
        documentId
        name
      }
      phoneNumber
    }
  }
`

export const GET_USER_BY_ID = gql`
  query UsersPermissionsUser($documentId: ID!) {
    usersPermissionsUser(documentId: $documentId) {
      username
      email
      blocked
      confirmed
      role {
        documentId
        name
      }
      phoneNumber
    }
  }
`
