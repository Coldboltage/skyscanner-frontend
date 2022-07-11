import { useState, useEffect } from "react";
// import updatedCodesLocations from "../constant/updatedCodesLocations";
import updatedCodesLocations from "../constant/singleNameCombined";


const AirportList = ({ text, state, setAirportFiltered }) => {
  const [airportList, setAirportList] = useState([])
  // We've got text, let's do something with it
  let airportTextCheck = updatedCodesLocations.filter((element, index) => {
    // if text only has two characters, fail it
    if (text.length < 3) {
      return false;
    }
    // Easy. Check if the airport name in skyscannerNameWithCode

    return (
      element.skyscannerNameWithCode
        .toLowerCase()
        .includes(text.toLowerCase()) 
        || element.location.toLowerCase().includes(text.toLowerCase()) 
    );
  }).sort((a,b) => {return a.skyscannerNameWithCode.length - b.skyscannerNameWithCode.length});
  
  useEffect(() => {
    console.log(airportTextCheck)
    setAirportFiltered(airportTextCheck)
  }, [text])
  return (
    <>
      {airportTextCheck.map((airport, index) => {
        // if (text === airport.skyscannerNameWithCode) {
        //   console.log(text)
        //   console.log(airport.skyscannerNameWithCode)
        //   console.log("Wahoo")
        //   setDepartureMatch(true)
        // } else {
        //   setDepartureMatch(false)
        // }
        return (
          <>
            <a onMouseDown={() =>{
               state(airport.skyscannerNameWithCode)
               console.log(airport.skyscannerNameWithCode)
            }}>
              {airport.skyscannerNameWithCode}
            </a>
          </>
        );
      })}
      {(airportTextCheck.length === 0 && text.length > 3) && <a>❌❌❌❌❌❌</a>}
      {(airportTextCheck.length === 0 && text.length < 3) && <a>Please type more than three characters</a>}
    </>
  );
};

export default AirportList;
