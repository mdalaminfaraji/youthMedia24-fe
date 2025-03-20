import { gql } from '@apollo/client'

export const CREATE_CATEGORY_MUTATION = gql`
  mutation CreateCategory(
    $data: CategoryInput!
    $locale: I18NLocaleCode
    $status: PublicationStatus
  ) {
    createCategory(data: $data, locale: $locale, status: $status) {
      name
      locale
      documentId
      description
    }
  }
`

export const UPDATE_CATEGORY_MUTATION = gql`
  mutation UpdateCategory(
    $data: CategoryInput!
    $documentId: ID!
    $locale: I18NLocaleCode
  ) {
    updateCategory(data: $data, documentId: $documentId, locale: $locale) {
      name
      locale
      documentId
      description
    }
  }
`

export const DELETE_CATEGORY_MUTATION = gql`
  mutation DeleteCategory($documentId: ID!) {
    deleteCategory(documentId: $documentId) {
      documentId
    }
  }
`

export const PUBLISH_CATEGORY_MUTATION = gql`
  mutation PublishCategory($documentId: ID!) {
    publishCategory(documentId: $documentId) {
      documentId
    }
  }
`

export const UNPUBLISH_CATEGORY_MUTATION = gql`
  mutation UnpublishCategory($documentId: ID!) {
    unpublishCategory(documentId: $documentId) {
      documentId
    }
  }
`
