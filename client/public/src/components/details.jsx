import React from 'react';
import ReactDOM from 'react-dom';

import {Price} from '../styling/styles.jsx';
import {Ratings, FullStars, EmptyStars, ReviewsCount} from '../styling/stars.jsx'

const Details = ({product}) => {
  return (
    <div>
      <Price>${product.price}</Price>
      <Ratings>
        <EmptyStars/>
        <FullStars width={(product.reviews * 20).toString()} />

        <ReviewsCount> {product.reviewcount}</ReviewsCount>
      </Ratings>
    </div>
  )
}

export default Details;
