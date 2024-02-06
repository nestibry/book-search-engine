import { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Button,
    Row,
    Col
} from 'react-bootstrap';

import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';

import { QUERY_ME } from '../utils/queries';
import { useQuery } from '@apollo/client';

import { REMOVE_BOOK } from '../utils/mutations';
import { useMutation } from '@apollo/client';

import { saveBookIds } from '../utils/localStorage';


const SavedBooks = () => {
    const { loading, data } = useQuery(QUERY_ME);
    
    const [ removeBook, { error }] = useMutation(REMOVE_BOOK);
    
    const userData = data?.me || {};
    
    const mySavedBookIds = userData?.savedBooks?.map((book) => book?.bookId) || [];
    saveBookIds(mySavedBookIds);

    
    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            await removeBook({ variables: { bookId: bookId } });
            
            // upon success, remove book's id from localStorage
            removeBookId(bookId);

        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }
    
    // Redirect to main page if token has expired but the page was still open in the browser
    if (!loading && !data){
        window.location.assign('/');
    }

    return (
        <>
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
