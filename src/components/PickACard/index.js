import React from "react";

import './styles.css'; 

const PickACard = ({ imagesArr, setStartMagic }) => {
  
  const handleClick = () => {
    setStartMagic(true);
  };

  const render21Cards = () => {
    return (
      <>
        <p>
            <strong>Choose one of the cards below and memorize it. </strong> <br></br>
            I will try to read your mind and guess the card! ;)
        </p>
        <button onClick={handleClick}>
          I did it! Show me the magic!
        </button>
        <div className = "cards">
          {imagesArr.map((image, index) => (
            <img                
                key={index}
                src={`${image}`}
                alt = ""                
            />
          ))}
        </div>
      </>
    );
  };

  //Loop through the 21 card images and display them for user to mentally pick a card.
  return (
    <div className = 'list-cards'>
      {imagesArr.length === 21 ? render21Cards() : <h1>No cards :(</h1>}
    </div>
  );
};

export default PickACard;
