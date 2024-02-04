import { gql } from '@apollo/client';

export const LOGIN_USER = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
        }
    }
`;

export const ADD_USER = gql`
    mutation addUser($username: String!, $email: String!, $password: String!) {
        addUser(username: $username, email: $email, password: $password) {
            token
        }
    }
`;

export const SAVE_BOOK = gql`
    mutation saveBook($bookInput: BookInput!) {
        saveBook(bookInput: $bookInput) {
            # Need to return something, but no data is being used at this time
            bookCount
        }
    }
`;

export const REMOVE_BOOK = gql`
    mutation removeBook($bookId: String!) {
        removeBook(bookId: $bookId) {
            _id
            username
            email
            bookCount
            savedBooks {
                _id
                bookId
                title
                description
                authors
                image
                link
            }
        }
    }
`;