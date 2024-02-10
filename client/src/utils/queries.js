import { gql } from '@apollo/client';

export const QUERY_ME = gql`
    query me {
        me {
            _id
            username
            email
            bookCount
            savedBooks {
                _id
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
`;

export const QUERY_SAVED_BOOKS = gql`
    query SavedBooks {
        me {
            savedBooks {
                _id
                bookId
                title
                authors
                description
                image
                link
            }
        }
    }
`;