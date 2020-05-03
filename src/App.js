import React, { useState, useEffect } from 'react';
import api from './services/api';

import Header from "./components/Header";
import PickACard from "./components/PickACard";
import ThreePiles from "./components/ThreePiles";

function App() {
  //Full Deck, with 52 shuffled cards
  const [newDeck, setNewDeck] = useState(null); 
  
  //An array with 21 card codes (will be used to get partial deck)
  const [codeCardsArr, setCodeCardsArr] = useState([]); 
  
  //Array with 21 card images (to draw them in screen)
  const [imagesArr, setImagesArr] = useState([]); 

  //Partial deck containing the 21 cards of the game
  const [partialDeck, setPartialDeck] = useState(null); 

  //Start the magic! (The user define this clicking in a button)
  const [startMagic, setStartMagic] = useState(false); 

  const [restart, setRestart] = useState(false);

  //Get initial deck (and it id) of 52 cards
  useEffect(() => {
    if(restart === false){
      api
        .get(`/new/shuffle/`)
        .then(res => {
          setNewDeck(res.data);        
        })
        .catch(err => console.error(err));
    }
  }, [restart]);

  //Select 21 randon cards from the initial deck
  useEffect(() => {
    if (newDeck && restart === false) {
      api
        .get(`${newDeck.deck_id}/draw/?count=21`)
        .then(res => {
          res.data.cards.forEach(card => {            
            setCodeCardsArr(contentArr => [...contentArr, card.code]);
            setImagesArr(contentArr => [...contentArr, card.image]);
          });
        })
        .catch(err => console.error(err));
    }
  }, [newDeck, restart]);

  //Create the new partial deck with only 21 cards
  //Ex: https://deckofcardsapi.com/api/deck/new/shuffle/?cards=AS,2S,KS,AD,2D,KD,AC,2C,KC,AH,2H,KH
  useEffect(() => {
    if (codeCardsArr.length === 21 && restart === false) {
      api
        .get(`/new/shuffle/?cards=${codeCardsArr.join(",")}`)
        .then(res => 
          setPartialDeck(res.data)
        )
        .catch(err => console.error(err));
    }
  }, [codeCardsArr, restart]);

  //Use partial deck to create the pile of cards - pile name: main
  useEffect(() => {
    if(partialDeck && restart === false)
    {
      api
        .get(`${partialDeck.deck_id}/draw/?count=21`)
        .then(res =>
          api
            .get(
              `${partialDeck.deck_id}/pile/main/add/?cards=${res.data.cards
                .map(card => card.code)
                .join(",")}`
            )
            .then()
            .catch(err => console.error(err))
        )
        .catch(err => console.error(err));
    }
  }, [partialDeck, restart])

  return (
    <div className="App">
      <Header />
      {
        //Button not selected? Show the cards
        !startMagic ? (
            <PickACard imagesArr={imagesArr} setStartMagic={setStartMagic} /> 
          )  : (
            <ThreePiles deck_id={partialDeck.deck_id} setRestart = {setRestart} setStartMagic = {setStartMagic} />        
          )
      } 
    </div>
  );
}

export default App;
