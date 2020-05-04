import React from 'react';

import './styles.css';

const Piles = ({pileNumber, pileImages, setPiles, setPilePicked, setRound, setPileOne, setPileThree}) => {
  
  const handleClick = () => {
    setRound(round => round - 1); 

    setPileOne(pileNumber[0].toString());
    setPilePicked(pileNumber[1].toString());
    setPileThree(pileNumber[2].toString());
    setPiles({
      0:[],
      1:[],
      2:[]
    });
  };

  return(
    <div className={`pile${pileNumber[1]}`}>
      <button className = {`button${pileNumber[1]}`} onClick={handleClick}> {pileNumber[1]} </button>
      {pileImages.length > 0 ?
        pileImages.map((image, index) => (
          <img
            key={index}
            alt=""
            src={image}            
          />
        ))
        : null
      }
    </div>
  );
}


export default Piles;