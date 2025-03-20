import { gql } from '@apollo/client'

export const GET_ALL_ARTICLES = gql`
  query Articles($locale: I18NLocaleCode) {
    articles(locale: $locale) {
      documentId
      description
      isTreanding
      banglaSlug
      cover {
        url
      }
      createdAt
      title
      category {
        name
      }
    }
  }
`

export const GET_SINGLE_ARTICLES = gql`
  query Article($documentId: ID!) {
    article(documentId: $documentId) {
      documentId
      title
      description
      content
      newsContent
      views
      likes
      banglaSlug
      slug
      isTreanding
      category {
        name
      }
      createdAt
      updatedAt
      cover {
        url
      }
      comments {
        content
        createdAt
        user {
          username
        }
      }
    }
  }
`

export const GET_ARTICLES_WITH_SPECIFIC_CATEGORY = gql`
  query Articles($locale: I18NLocaleCode, $filters: ArticleFiltersInput) {
    articles(locale: $locale, filters: $filters) {
      documentId
      description
      banglaSlug
      isTreanding
      cover {
        url
      }
      title
      category {
        name
      }
    }
  }
`
export const GET_ARTICLES_BY_BANGLA_SLUG = gql`
  query Articles($locale: I18NLocaleCode, $filters: ArticleFiltersInput) {
    articles(locale: $locale, filters: $filters) {
      documentId
      title
      description
      content
      views
      cover {
        url
      }
      likes
      category {
        name
      }
      comments {
        content
        createdAt
        author {
          name
        }
      }
    }
  }
`
export const GET_MOST_VIEWED_ARTICLES = gql`
  query Articles($locale: I18NLocaleCode) {
    articles(locale: $locale, sort: "views:desc") {
      documentId
      views
      banglaSlug
      cover {
        url
      }
      title
      category {
        name
      }
    }
  }
`
