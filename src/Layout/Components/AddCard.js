import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { createCard, readDeck } from "../../utils/api/index";
import SharedForm from "./SharedForm"

function AddCard() {
    const mountedRef = useRef(false);
    // Default for new card data
    const initialFormState = {
      id: '',
      front: '',
      back: '',
      deckId: '',
    };
    const [deck, setDeck] = useState({
      name: 'loading...',
      description: '',
      cards: [],
    });
    const [newCard, setNewCard] = useState(initialFormState);
    const history = useHistory();
    const { deckId } = useParams();
    // effect just for tracking state
    useEffect(() => {
      mountedRef.current = true;
      return () => {
        mountedRef.current = false;
      };
    }, []);
  
    // Load deck effect
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
  
    // change handler for new card data changes
    const handleChange = ({ target }) => {
      setNewCard((currentState) => ({
        ...currentState,
        [target.name]: target.value,
      }));
    };
  
    
    const handleSubmit = async (event) => {
      event.preventDefault();
      await createCard(deckId, newCard);
      setNewCard(initialFormState);
      history.go(0);
    };
    return (
        <div>
            <ol className="breadcrumb">
                <li className="breadcrumb-item">
                    <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                    <Link to={`/decks/${deckId}`}>{deck.name}</Link>
                </li>
                <li className="breadcrumb-item active">Add Card</li>
            </ol>
            <SharedForm changeHandler={handleChange} submitHandler={handleSubmit} deckId={deckId} newCardData={newCard}/>
        </div>
    );
}

export default AddCard;