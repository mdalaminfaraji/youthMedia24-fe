import { gql } from "@apollo/client";

export const GET_ALL_CATEGORIES = gql`
  query Category($locale: I18NLocaleCode) {
    categories(locale: $locale) {
      documentId
      name
      description
      locale
    }
  }
`;
