const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        getUsers: async () => {
            return User.find();
        },
        
        // getSingleUser

    },

    // Mutation: {
    //     // createUser

    //     // login

    //     // saveBook

    //     // deleteBook

    // },
};

module.exports = resolvers;