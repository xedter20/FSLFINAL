import React from 'react'
import "./Header.css"


const Header = () => {
  return (
    <div className="signlang__header section__padding gradient__bg" id="home">

      <div className="signlang__header-content">
        <h1 className="text-3xl font-bold underline text-white">
          Hello world!
        </h1>
        <h1 className="">Increase your Cognitive Brain Power with ss.</h1>


      </div>
      {/* <div className="signlang__header-image">
        <img src={SignHand} alt='SIGN-HAND' />
      </div> */}
    </div>
  )
}

export default Header