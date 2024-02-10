import { useState, useEffect } from 'react';
import {
    Container,
    Col,
    Form,
    Button,
    Card,
    Row
} from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

import Auth from '../utils/auth';

import { searchGoogleBooks } from '../utils/API';
import { saveBookIds, getSavedBookIds } from '../utils/localStorage';

import { useMutation } from '@apollo/client';
import { SAVE_BOOK } from '../utils/mutations';

import { QUERY_SAVED_BOOKS } from '../utils/queries';
import { useApolloClient } from '@apollo/client';

import { QUERY_ME } from '../utils/queries';
import { useQuery } from '@apollo/client';

const SearchBooks = () => {
    // create state for holding returned google api data
    const [searchedBooks, setSearchedBooks] = useState([]);
    // create state for holding our search field data
    const [searchInput, setSearchInput] = useState('');

    // create state to hold saved bookId values
    const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

    // set up useEffect hook to save `savedBookIds` list to localStorage on component unmount
    // learn more here: https://reactjs.org/docs/hooks-effect.html#effects-with-cleanup
    useEffect(() => {
        return () => saveBookIds(savedBookIds);
    });

    // SAVE_BOOK
    const [saveBook, { error }] = useMutation(SAVE_BOOK);

    // READ from InMemoryCache
    const client = useApolloClient();
    const { me } = client?.readQuery({ query: QUERY_SAVED_BOOKS}) || {};
    console.log(me);

    // QUERY_ME
    const { loading, data } = useQuery(QUERY_ME);
    const userData = data?.me || {};
    const mySavedBookIds = userData?.savedBooks?.map((book) => book?.bookId) || [];
    console.log(mySavedBookIds);

    // create method to search for books and set state on form submit
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        if (!searchInput) {
            return false;
        }

        try {
            const response = await searchGoogleBooks(searchInput);

            if (!response.ok) {
                throw new Error('something went wrong!');
            }

            const { items } = await response.json();
            const bookData = items.map((book) => ({
                bookId: book.id,
                authors: book.volumeInfo.authors || ['No author to display'],
                title: book.volumeInfo.title || 'No Title',
                description: book.volumeInfo.description || 'No description',
                image: book.volumeInfo.imageLinks?.thumbnail || '',
                link: book.volumeInfo.infoLink || ''
            }));

            console.log(bookData);
            setSearchedBooks(bookData);
            setSearchInput('');
        } catch (err) {
            console.error(err);
        }
    };

    // create function to handle saving a book to our database
    const handleSaveBook = async (bookId) => {
        // find the book in `searchedBooks` state by the matching id
        const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

        // get token
        const token = Auth.loggedIn() ? Auth.getToken() : null;

        if (!token) {
            return false;
        }

        try {
            await saveBook({ variables: { bookInput: { ...bookToSave } } });

            // if book successfully saves to user's account, save book id to state
            setSavedBookIds([...savedBookIds, bookToSave.bookId]);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <>
            <div className="text-light bg-dark p-5">
                <Container>
                    <h1>Search for Books!</h1>
                    <Form onSubmit={handleFormSubmit}>
                        <Row>
                            <Col xs={12} md={8}>
                                <Form.Control
                                    name='searchInput'
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    type='text'
                                    size='lg'
                                    placeholder='Search for a book'
                                />
                            </Col>
                            <Col xs={12} md={4}>
                                <Button type='submit' variant='success' size='lg'>
                                    Submit Search
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Container>
            </div>

            <Container>
                <h2 className='pt-5'>
                    {searchedBooks.length
                        ? `Viewing ${searchedBooks.length} results:`
                        : 'Search for a book to begin'}
                </h2>
                <Row>
                    {searchedBooks.map((book) => {
                        return (
                            <Col md={12} key={book.bookId} className='mb-4'>
                                <Card border='dark'>
                                    <Row>
                                        <Col xs={12} md={4}>
                                            {book.image ? (
                                                <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                                            ) : null}
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
                                                    {Auth.loggedIn() && (
                                                        <Button
                                                            disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                                                            className='btn-block btn-primary'
                                                            onClick={() => handleSaveBook(book.bookId)}>
                                                            {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                                                                ? 'Book Saved!'
                                                                : 'Save to Reading List'}
                                                        </Button>
                                                    )}
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

export default SearchBooks;
