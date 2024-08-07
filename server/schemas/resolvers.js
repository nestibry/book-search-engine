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
        addUser: async (parent, { username, email, password }) => {
            const user = await User.create({ username, email, password });
            const token = signToken(user);
            return { token, user };
        },

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

        // args = input BookInput {bookId: ID!, title: String!, description: String!, authors: [String], image: String, link: String }
        saveBook: async (parent, { bookInput } , context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $addToSet: { savedBooks: bookInput }},
                    { new: true, runValidators: true }
                );
                return updatedUser;
            }
            throw AuthenticationError;
        },

        removeBook: async (parent, { bookId }, context) => {
            if(context.user){
                const updatedUser = await User.findOneAndUpdate(
                    { _id: context.user._id },
                    { $pull: { savedBooks: { bookId } } },
                    { new: true }
                );
                return updatedUser;
            }
            throw AuthenticationError;
        },

    },
};

module.exports = resolvers;