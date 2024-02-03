import { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Button,
    Row,
    Col
} from 'react-bootstrap';

// import { getMe, deleteBook } from '../utils/API';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { QUERY_ME } from '../utils/queries';
import { useQuery } from '@apollo/client';

import { REMOVE_BOOK } from '../utils/mutations';
import { useMutation } from '@apollo/client';

import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from '@apollo/client';

const SavedBooks = () => {
    // const [userData, setUserData] = useState({});

    const cache = new InMemoryCache({
        typePolicies: {
          User: {
            fields: {
              savedBooks: {
                merge: true,
              },
            },
          },
        },
      });

    
    const { loading, data } = useQuery(QUERY_ME);
    
    const userData = data?.me || {};
    
    useEffect(() => {
        console.log(userData);
    }, [userData]);
    
    const [ removeBook, { error }] = useMutation(REMOVE_BOOK);
    



    // // use this to determine if `useEffect()` hook needs to run again
    // const userDataLength = Object.keys(userData).length;

    // useEffect(() => {
    //     const getUserData = async () => {
    //         try {
    //             const token = Auth.loggedIn() ? Auth.getToken() : null;

    //             if (!token) {
    //                 return false;
    //             }

    //             const response = await getMe(token);

    //             if (!response.ok) {
    //                 throw new Error('something went wrong!');
    //             }

    //             const user = await response.json();
    //             setUserData(user);
    //         } catch (err) {
    //             console.error(err);
    //         }
    //     };

    //     getUserData();
    // }, [userDataLength]);

    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            // const response = await deleteBook(bookId, token);

            // if (!response.ok) {
            //     throw new Error('something went wrong!');
            // }

            // const updatedUser = await response.json();
            // setUserData(updatedUser);

            await removeBook({ variables: { bookId: bookId } });
            

            // upon success, remove book's id from localStorage
            removeBookId(bookId);
        } catch (err) {
            console.error(err);
        }
    };

    // // if data isn't here yet, say so
    // if (!userDataLength) {
    //     return <h2>LOADING...</h2>;
    // }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            {/* <div fluid className="text-light bg-dark p-5"> */}
            <div className="text-light bg-dark p-5">
                <Container>
                    <h1>Viewing saved books!</h1>
                </Container>
            </div>
            <Container>
                <h2 className='pt-5'>
                    {userData.savedBooks.length
                        ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
                        : 'You have no saved books!'}
                </h2>
                <Row>
                    {userData.savedBooks.map((book) => {
                        return (
                            <Col key={book.bookId} md="4">
                                <Card  border='dark'>
                                    {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                                    <Card.Body>
                                        <Card.Title>{book.title}</Card.Title>
                                        <p className='small'>Authors: {book.authors}</p>
                                        <Card.Text>{book.description}</Card.Text>
                                        <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                                            Delete this Book!
                                        </Button>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            </Container>
        </>
    );
};

export default SavedBooks;
