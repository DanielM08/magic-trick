import React, { useState, useEffect } from "react";

import api from '../../services/api';
import Pile from '../Pile';
import './styles.css'; 

const ThreePiles = ({ deck_id, setRestart, setStartMagic }) => {

  const [remaining, setRemainingCards] = useState(21) //Number of cards in main pile
  const [pilePicked, setPilePicked] = useState(null);
  const [pileOne, setPileOne] = useState(null);
  const [pileThree, setPileThree] = useState(null);

  const [piles, setPiles] = useState({
    0: [],
    1: [],
    2: []
  });
  const [round, setRound] = useState(3); //Number of rounds to show the card
  const [finalCard, setFinalCard] = useState(null); //The image of the chosen card

  //Distribute the cards from main pile to the 3 piles  
  useEffect(() => {
    if(remaining > 0 && round > 0){
      console.log(deck_id)
      api
        .get(`/${deck_id}/pile/main/draw/?count=21`)
        .then(async res => {
          setRemainingCards(res.data.piles.main.remaining);

          for(let i = 0; i < 3; i++){
            //Construct each pile given their cards in the correct order: 
            //p1 -> p2 -> p3 -> p1 -> p2 -> p3 -> [...] -> p1 -> p2 -> p3 
            let codeCardsToPile = res.data.cards
              .filter((card, index) => index % 3 === i)
              .map(card => card.code)
              .join(',');
            let cardsImagesToPile = res.data.cards
              .filter((card, index) => index % 3 === i )
              .map(card => card.image);
            
            //create the piles with 7 cards
            try{
              await api.get(
                `${deck_id}/pile/pile${i}/add/?cards=${codeCardsToPile}`
              )
              setPiles(prevPile => ({
                ...prevPile, 
                [i] : cardsImagesToPile
              }));
            }catch(err){
              console.log(err)
            }
          }                
        })
        .catch(err => console.log(err));
    }
  }, [deck_id, remaining, round]);
  /*
  useEffect(() =>{
    if(remaining === 0){
      api
        .get(`/${deck_id}/pile/pile0/list/`)
        .then(resp =>{
          console.log(resp)
          api
            .get(`/${deck_id}/pile/pile1/list/`)
            .then(resp => {
              console.log(resp)
              api
                .get(`/${deck_id}/pile/pile2/list/`)
                .then(resp => {
                  console.log(resp)
                })
                .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  }, [deck_id, remaining]);
  */
  useEffect(() => {
    
    if (pilePicked !== null) {      
      api
        .get(
          `/${deck_id}/pile/pile${pileOne}/draw/?count=7`
        )
        .then(res => {          
          api
            .get(
              `/${deck_id}/pile/main/add/?cards=${res.data.cards
                .map(card => card.code)
                .join(",")}`
            )
            .then(res =>{
              api
                .get(
                  `/${deck_id}/pile/pile${pilePicked}/draw/?count=7`
                )
                .then(res => {
                  api
                    .get(
                      `/${deck_id}/pile/main/add/?cards=${res.data.cards
                        .map(card => card.code)
                        .join(",")}`
                    )
                    .then(res =>{
                      api
                        .get(
                          `/${deck_id}/pile/pile${pileThree}/draw/?count=7`
                        )
                        .then(res => {
                          api
                            .get(
                              `/${deck_id}/pile/main/add/?cards=${res.data.cards
                                .map(card => card.code)
                                .join(",")}`
                            )
                            .then(res =>{
                              setRemainingCards(res.data.piles.main.remaining);
                              setPilePicked(null)
                              setPileOne(null)
                              setPileThree(null)
                              setPiles({
                                0: [],
                                1: [],
                                2: []
                              });
                            }).catch(err => console.log(err));
                        })
                        .catch(err => console.log(err));
                    }).catch(err => console.log(err));
                })
                .catch(err => console.log(err));
            }).catch(err => console.log(err));
        })
        .catch(err => console.log(err));
    }
  }, [pilePicked, deck_id, pileOne, pileThree])

  //Revel the card selected by the person
  useEffect(() => {
    if (round === 0 && remaining === 21) {
      api
        .get(`/${deck_id}/pile/main/draw/?count=11`)
        .then(res => {
          setFinalCard(res.data.cards[0].image);
          //add all these 11 cards to the main pile again
          api.get(
            `/${deck_id}/pile/main/add/?cards=${res.data.cards
              .map(card => card.code)
              .join(",")}`
          )
          .then()
          .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
    }
  }, [remaining, round, deck_id]);

  const renderPiles = () => {
    return (
      <>  
      {renderTitle()} 
      {
        piles[2].length > 0 ? (
          <>
            <Pile
                pileNumber = {[1, 0, 2]}
                pileImages = {piles[0]}
                setPiles = {setPiles}
                setPilePicked = {setPilePicked}
                setRound = {setRound}
                setPileOne = {setPileOne}
                setPileThree = {setPileThree}
            />
            <Pile
              pileNumber = {[0, 1, 2]}
              pileImages = {piles[1]}
              setPiles = {setPiles}
              setPilePicked = {setPilePicked}
              setRound = {setRound}
              setPileOne = {setPileOne}
              setPileThree = {setPileThree}
            />
            <Pile
              pileNumber = {[1, 2, 0]}
              pileImages = {piles[2]}
              setPiles = {setPiles}
              setPilePicked = {setPilePicked}
              setRound = {setRound}
              setPileOne = {setPileOne}
              setPileThree = {setPileThree}
            />
          </>
        ) : <h1>Wait!</h1>  
      }
      </>
    );
  };

  const renderTitle = () => {
    return (
      <>
        <div>
          {
            round === 3 ? (
              <p>
                Please, tell me, in which pile is your card in? <br />
              </p>
            ) : round === 2 ? (
              <p>
                One more time... in which pile is your card in? <br />
              </p>
            ) :  (
              <p>
                The last time! In which pile is your card in? ;) <br />
              </p>  
            )        
          }
        </div>
      </>
    );
  };

  const handleClick = () => {
    setRestart(true);
    setStartMagic(false);
    setRound(3)
    setFinalCard(null);
  };

  const renderFinalCard = () => {
    return (
      <>
        <div className = "final">
          <p>Your card... hehe</p>
          <img 
            src={finalCard} alt=""       
          />
          <p>          
            <button onClick={handleClick} href = "/"> Try Again? </button>
          </p>
        </div>
      </>
    );
  };

  return (
    <div className = "principal">
        {finalCard ? renderFinalCard() : renderPiles()}
    </div>
  );
}


export default ThreePiles;