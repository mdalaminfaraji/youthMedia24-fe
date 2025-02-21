import { gql } from '@apollo/client'

export const CREATE_COMMENT_MUTATION = gql`
  mutation CreateComment($data: CommentInput!, $locale: I18NLocaleCode) {
    createComment(data: $data, locale: $locale) {
      documentId
      content
      user {
        username
      }
      createdAt
    }
  }
`
