import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { readCard, readDeck, updateCard } from "../../utils/api/index";
import SharedForm from "./SharedForm"

function EditCard() {
    const mountedRef = useRef(false);
    const { deckId, cardId } = useParams();
    const history = useHistory();
  
    const initialCardState = { id: '', front: '', back: '', deckId: '' };
    const [deck, setDeck] = useState({
      name: 'loading...',
      description: '',
    });
    const [editCard, setEditCard] = useState(initialCardState);
  
    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);
  
    useEffect(() => {
      const abortController = new AbortController();
      async function loadDeck() {
        try {
          const loadedDeck = await readDeck(deckId, abortController.signal);
          if (mountedRef.current) {
            setDeck(() => loadedDeck);
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            throw error;
          }
        }
      }
  
      loadDeck();
      return () => {
        abortController.abort();
      };
    }, [deckId]);
  
    useEffect(() => {
      const abortController = new AbortController();
      async function loadCard() {
        try {
          const loadedCard = await readCard(cardId, abortController.signal);
          if (mountedRef.current) {
            setEditCard(() => loadedCard);
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            throw error;
          }
        }
      }
      loadCard();
      return () => {
        abortController.abort();
      };
    }, [cardId]);
  
    const handleChange = ({ target }) => {
      setEditCard((currentState) => ({
        ...currentState,
        [target.name]: target.value,
      }));
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
      await updateCard(editCard);
      setEditCard(initialCardState);
      history.push(`/decks/${deckId}`);
    };

    return (
        <div>
            <nav aria-label='breadcrumb'>
        <ol className='breadcrumb'>
          <li className='breadcrumb-item'>
            <Link to='/'>
              <i className='fas fa-home'></i> Home
            </Link>
          </li>
          <li className='breadcrumb-item'>
            <Link to={`/decks/${deckId}`}>{deck.name}</Link>
          </li>
          <li className='breadcrumb-item active' aria-current='page'>
            Edit Card {cardId}
          </li>
        </ol>
      </nav>
      <h1 className='text-center'>Edit Card</h1>
            <SharedForm changeHandler={handleChange} submitHandler={handleSubmit} deckId={deckId} newCardData={editCard}/>
        </div>
    );
}

export default EditCard;