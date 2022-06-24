import React from "react";
import * as styles from "../styles/CheapestFlightsItem.module.css";

const ReferenceItem = ({ reference }) => {
  return (
    <div className={styles.inputForm}>
      <div className={styles.individualPara}>
        {reference}
      </div>
    </div>
  );
};

export default ReferenceItem;
