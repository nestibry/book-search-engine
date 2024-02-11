import { useState, useEffect } from 'react';
import {
    Container,
    Card,
    Button,
    Row,
    Col
} from 'react-bootstrap';

import Auth from '../utils/auth';

import { QUERY_ME } from '../utils/queries';
import { useQuery } from '@apollo/client';

import { REMOVE_BOOK } from '../utils/mutations';
import { useMutation } from '@apollo/client';

const SavedBooks = () => {
    const { loading, data } = useQuery(QUERY_ME);
    const userData = data?.me || {};

    const [removeBook, { error }] = useMutation(REMOVE_BOOK);

    // create function that accepts the book's mongo _id value as param and deletes the book from the database
    const handleDeleteBook = async (bookId) => {
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            await removeBook({ variables: { bookId: bookId } });

        } catch (err) {
            console.error(err);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    // Redirect to main page if token has expired but the page was still open in the browser
    if (!loading && !data) {
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
                            <Col key={book.bookId} md={12} className='mb-4'>
                                <Card border='dark'>
                                    <Row>
                                        <Col xs={12} md={4}>
                                            {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                                        </Col>
                                        <Col xs={12} md={8}>
                                            <Card.Body>
                                                <Card.Title>{book.title}</Card.Title>
                                                <p className='small'>Authors: {book.authors}</p>
                                                <Card.Text>{book.description}</Card.Text>
                                                <Row className='m-1'>
                                                    <Button
                                                        disabled={!book.link}
                                                        className='mb-2 btn-block btn-secondary'
                                                        onClick={() => window.open(book.link, '_blank')}>
                                                        Google Books Info
                                                    </Button>
                                                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                                                        Remove from Reading List!
                                                    </Button>
                                                </Row>
                                            </Card.Body>
                                        </Col>
                                    </Row>
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
