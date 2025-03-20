import { gql } from '@apollo/client'

export const GET_ALL_CATEGORIES = gql`
  query Category($locale: I18NLocaleCode) {
    categories(locale: $locale) {
      documentId
      name
      description
      locale
    }
  }
`

export const GET_CATEGORY_BY_ID = gql`
  query CategoryById($documentId: ID!) {
    category(documentId: $documentId) {
      documentId
      name
      description
      locale
    }
  }
`
