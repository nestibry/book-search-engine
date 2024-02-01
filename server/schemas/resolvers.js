const { User } = require('../models');
const { signToken, AuthenticationError } = require('../utils/auth');

const resolvers = {
    Query: {
        users: async () => {
            return User.find();
        },
        
        // Get Authenticated User's Information
        me: async (parent, args, context) => {
            if(context.user){
                return User.findById(context.user._id);
            }
            throw AuthenticationError;
        },

    },

    Mutation: {
        // createUser

        login: async (parent, { email, password }) => {
            const user = await User.findOne({ email });

            if (!user) {
                throw AuthenticationError;
            }

            const correctPw = await user.isCorrectPassword(password);

            if (!correctPw) {
                throw AuthenticationError;
            }
            
            const token = signToken(user);

            return { token, user };
        },

        // saveBook

        // deleteBook

    },
};

module.exports = resolvers;