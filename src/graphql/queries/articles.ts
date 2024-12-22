import { gql } from '@apollo/client'

export const GET_ALL_ARTICLES = gql`
  query Articles($locale: I18NLocaleCode) {
    articles(locale: $locale) {
      documentId
      description
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
  query Article($locale: I18NLocaleCode, $documentId: ID!) {
    article(locale: $locale, documentId: $documentId) {
      documentId
      title
      description
      content
      cover {
        url
      }
      likes
      category {
        name
      }
      news_status
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

export const GET_ARTICLES_WITH_SPECIFIC_CATEGORY = gql`
  query Articles($locale: I18NLocaleCode, $filters: ArticleFiltersInput) {
    articles(locale: $locale, filters: $filters) {
      documentId
      description
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
export const GET_ARTICLES_BY_BANGLA_SLUG = gql`
  query Articles($locale: I18NLocaleCode, $filters: ArticleFiltersInput) {
    articles(locale: $locale, filters: $filters) {
      documentId
      title
      description
      content
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
