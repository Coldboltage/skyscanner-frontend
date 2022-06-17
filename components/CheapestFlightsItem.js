import React from "react";
import * as styles from "../styles/CheapestFlightsItem.module.css";

const cheapestFlightsItem = ({ flight, bestOrCheapest }) => {
  const {cost, time, arrival, durationOfFlight} = flight[bestOrCheapest]
  const {flightDatesString: {departDate, returnDate}, url} = flight
  return (
    <div className={styles.inputForm}>
      <p className={styles.individualPara}>
        <span className={styles.titleItem}>Cost</span>:
         £{cost}
      </p>
      <p className={styles.individualPara}>
        <span className={styles.titleItem}>Dates</span>:
        {` `}{departDate} - {returnDate}
      </p>
      <p className={styles.individualPara}>
        <span className={styles.titleItem}>Time</span>
        {` `}{time} - {arrival}
      </p>
      <p className={styles.individualPara}>
        <span className={styles.titleItem}>Duration</span>
        {` `}{durationOfFlight} 
      </p>
      <a href={url} className={`${styles.individualPara} ${styles.link}`}>
        <span className={styles.titleItem}>Skyscanner Link</span>
        {` `}<a href={url}>Flight Link</a>
      </a>
    </div>
  );
};

export default cheapestFlightsItem;
