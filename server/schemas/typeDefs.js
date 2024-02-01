const typeDefs = `
    input BookInput {
        bookId: ID!
        title: String!
        description: String!
        authors: [String]
        image: String
        link: String
    }

    type User {
        _id: ID
        username: String
        email: String
        # password: String
        savedBooks: [Book]!
        bookCount: Int
    }

    type Book {
        # _id: ID
        authors: [String]!
        description: String
        bookId: String
        image: String
        link: String
        title: String
    }

    type Auth {
        token: ID!
        user: User
    }

    type Query {
        users: [User]
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth
        # saveBook(bookId: String!, title: String!, description: String!, authors: [String], image: String, link: String): User
        saveBook(bookInput: BookInput!): User
        removeBook(bookId: String!): User
    }

`;

module.exports = typeDefs;