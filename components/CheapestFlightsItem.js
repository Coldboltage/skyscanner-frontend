import React from "react";
import * as styles from "../styles/CheapestFlightsItem.module.css";

const cheapestFlightsItem = ({ flight, bestOrCheapest }) => {
  const { cost, time, arrival, durationOfFlight } = flight[bestOrCheapest];
  const {
    flightDatesString: { departDate, returnDate },
    url,
  } = flight;
  return (
    <div className={styles.inputForm}>
      <div className={styles.individualPara}>
        <span className={styles.titleItem}>Cost</span>: £{cost}
      </div>
      <div className={styles.individualPara}>
        <span className={styles.titleItem}>Dates</span>:{` `}
        {departDate} - {returnDate}
      </div>
      <div className={styles.individualPara}>
        <span className={styles.titleItem}>Time</span>
        {` `}
        {time} - {arrival}
      </div>
      <div className={styles.individualPara}>
        <span className={styles.titleItem}>Duration</span>
        {` `}
        {durationOfFlight}
      </div>
      <div className={styles.individualPara}>
        <a href={url} className={`${styles.individualPara} ${styles.link}`}>
          <span className={styles.titleItem}>Skyscanner Link</span>
          {` `}
          <a href={url}>Flight Link</a>
        </a>
      </div>
    </div>
  );
};

export default cheapestFlightsItem;
