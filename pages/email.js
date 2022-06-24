import Head from "next/head";
import Image from "next/image";
import styles from "../styles/ref.module.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import * as dayjs from "dayjs";

// Component List
import Layout from "../components/Layout";
import AirportList from "../components/AirportList";
import CheapestFlightsItem from "../components/CheapestFlightsItem";

export default function Ref() {
  // Console.log test
  console.log(`env ${process.env.NEXT_PUBLIC_LOCALHOST}`);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [ref, setRef] = useState("");
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [minimalHoliday, setMinimalHolday] = useState("");
  const [maximumHoliday, setMaximumHoliday] = useState("");
  const [requiredDateStart, setRequiredDateStart] = useState();
  const [requiredDateEnd, setRequiredDateEnd] = useState();

  // State specifically for /ref
  const [typedState, setTypedState] = useState("");
  const [cheapestFlights, setCheapestFlights] = useState([]);
  const [bestFlights, setBestFlights] = useState([]);

  console.log(cheapestFlights);

  // useEffect(() => {
  //   airportTextCheck(departure)
  // }, departure)

  // State for managed dates

  const getEmail = async (reference) => {
    console.log(
      `I'm making a call to /reference-info-latest-flight with the reference: ${reference}`
    );
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_LOCALHOST ||
          "https://skyscannerplusweb.herokuapp.com"
        }/api/flights/reference-info-latest-flight/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          cors: "no-cors",
          body: JSON.stringify({ reference: reference }),
        }
      );
      console.log("Sent");
      console.log(response)
      if ((response.ok === true)) {
        toast.success('Flight found!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
        const data = await response.json();
        // Destructure Result
        const {
          user: { name, email },
          ref,
          flights: { arrival, departure },
          dates: { departureDate, returnDate, minimalHoliday, maximumHoliday },
        } = data.result;
        setName(name);
        setEmail(email);
        setRef(ref);
        setArrival(arrival);
        setDeparture(departure);
        setDepartureDate(dayjs(departureDate).format("DD, MMMM YYYY"));
        setReturnDate(dayjs(returnDate).format("DD, MMMM YYYY"));
        setMinimalHolday(minimalHoliday);
        setMaximumHoliday(maximumHoliday);
        // Checking latestFlight
        const { bestFlightsOrderMax, cheapestFlightsOrderMax } =
          data.latestFlights;
        setCheapestFlights(cheapestFlightsOrderMax);
        setBestFlights(bestFlightsOrderMax);
      } else {
        console.log("Nothing was found")
        toast.error('No flight could be found with that reference', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Find Flight by Email Address</title>
          <meta name="description" content="Find your flight by reference" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.titleDiv}>
          <h1 className={styles.title}>
            Find your flights by {" "}
            <span className={styles.flight}>Email Address</span>{" "}
          </h1>
        </div>
        <main className={styles.main}>
          <div>
            <div className={styles.referenceInput}>
              <h3>Your Email Address</h3>
              <div>
                <div>
                  <label>Your Email Address</label>
                  <input
                    type="text"
                    value={typedState}
                    onChange={(e) => setTypedState(e.target.value)}
                  />
                </div>
                <input
                  type="submit"
                  onClick={() => getEmail(typedState)}
                />
              </div>
            </div>
          </div>
          {/* Check if flight exists */}
          {cheapestFlights.length > 0 && (
            <>
              <div className={styles.inputForm}>
                <h3>Cheapest Flights</h3>
                <div className={styles.flightsContainer}>
                  {" "}
                  {cheapestFlights.map((element, index) => {
                    return (
                      <CheapestFlightsItem
                        key={index}
                        flight={element}
                        bestOrCheapest="cheapest"
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
          {bestFlights.length > 0 && (
            <>
              <div className={styles.inputForm}>
                <h3>Best Flights</h3>
                <div className={styles.flightsContainer}>
                  {" "}
                  {cheapestFlights.map((element, index) => {
                    return (
                      <CheapestFlightsItem
                        key={index}
                        flight={element}
                        bestOrCheapest="best"
                      />
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </Layout>
  );
}
