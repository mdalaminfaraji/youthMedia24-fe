import { gql } from '@apollo/client'

export const CREATE_ARTICLE_MUTATION = gql`
  mutation CreateArticle(
    $data: ArticleInput!
    $locale: I18NLocaleCode
    $status: PublicationStatus
  ) {
    createArticle(data: $data, locale: $locale, status: $status) {
      documentId
      banglaSlug
      description
      updatedAt
      newsStatus
    }
  }
`

export const UPDATE_ARTICLE_MUTATION = gql`
  mutation UpdateArticle(
    $data: ArticleInput!
    $documentId: ID!
    $locale: I18NLocaleCode
  ) {
    updateArticle(data: $data, documentId: $documentId, locale: $locale) {
      documentId
    }
  }
`

export const DELETE_ARTICLE_MUTATION = gql`
  mutation DeleteArticle($documentId: ID!) {
    deleteArticle(documentId: $documentId) {
      documentId
    }
  }
`

export const PUBLISH_ARTICLE_MUTATION = gql`
  mutation PublishArticle($documentId: ID!) {
    publishArticle(documentId: $documentId) {
      documentId
    }
  }
`

export const UNPUBLISH_ARTICLE_MUTATION = gql`
  mutation UnpublishArticle($documentId: ID!) {
    unpublishArticle(documentId: $documentId) {
      documentId
    }
  }
`
