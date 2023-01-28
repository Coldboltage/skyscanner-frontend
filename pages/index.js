import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShortUniqueId from "short-unique-id";
import Mobile from "is-mobile";
import { useVisitorData } from "@fingerprintjs/fingerprintjs-pro-react";
import { useRouter } from "next/router";
import CurrencySelector from "../components/currencySelector";
import { useUser } from "@auth0/nextjs-auth0";

// Component List
import Layout from "../components/Layout";
import AirportList from "../components/AirportList";
import singleNameCombined from "../constant/singleNameCombined";
import EmailOrLoginButtons from "../components/EmailOrLoginButtons";

const uid = new ShortUniqueId({ length: 10 });

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState(null);
  // Confirm Email Address
  const [confirmEmailAddress, confirmSetEmailAddress] = useState("");
  const [ref, setRef] = useState(uid().toUpperCase());
  const [returnFlight, setReturnFlight] = useState(true);
  // Needed flight information
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [departureDate, setDepartureDate] = useState();
  const [returnDate, setReturnDate] = useState();
  const [minimalHoliday, setMinimalHolday] = useState();
  const [maximumHoliday, setMaximumHoliday] = useState();
  // Storing Previous State for Minimal and Max holiday
  const [minimalHolidayPrevious, setMinimalHolidayPrevious] = useState();
  const [maximumHolidayPrevious, setMaximumHolidayPrevious] = useState();
  // Special
  const [requiredDateStart, setRequiredDateStart] = useState();
  const [requiredDateEnd, setRequiredDateEnd] = useState();
  const [weekendOnly, setWeekendOnly] = useState(false);
  // Style base state
  const [successful, setSuccessful] = useState(false);
  const [failed, setFailed] = useState(false);
  const [departureMatch, setDepartureMatch] = useState(false);
  const [arrivalMatch, setArrivalMatch] = useState(false);
  // Flight List stuff
  const [departureAirportFiltered, setDepartureAirportFiltered] = useState([]);
  const [arrivalAirportFiltered, setArivalAirportFiltered] = useState([]);
  const [currency, setCurrency] = useState({
    fullCurrency: "EUR - €",
    currencyCode: "EUR",
  });
  const [alertPrice, setAlertPrice] = useState();
  // FingerprintJS
  const [fingerPrint, setFingerPrint] = useState("");

  const { data } = useVisitorData({ immediate: false });
  console.log(data);

  const Router = useRouter();

  const { user, error, isLoading } = useUser();

  useEffect(() => {
    successOrFailure(confirmEmailAddress === email);

    // if (confirmEmailAddress === email && email.length > 4) {
    //   const fetchData = async (email) => {
    //     console.log(email);
    //     const response = await fetch(
    //       `${
    //         process.env.NEXT_PUBLIC_LOCALHOST ||
    //         "https://skyscannerplusweb.herokuapp.com"
    //       }/api/users/check-email-address/`,
    //       {
    //         method: "POST",
    //         cors: "no-cors",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({ email: email }),
    //       }
    //     );
    //     const data = await response.json();
    //     return data
    //   };
    // }
  }, [confirmEmailAddress, email]);

  useEffect(() => {
    const test = departureAirportFiltered.some(
      (element) => element.skyscannerNameWithCode === departure
    );
    const test2 = arrivalAirportFiltered.some(
      (element) => element.skyscannerNameWithCode === arrival
    );
    test === true ? setDepartureMatch(true) : setDepartureMatch(false);
    test2 === true ? setArrivalMatch(true) : setArrivalMatch(false);
  }, [departure, arrival, departureAirportFiltered, arrivalAirportFiltered]);

  useEffect(() => {
    if (
      (new Date(returnDate) - new Date(departureDate)) / 86400000 <
        maximumHoliday ||
      (new Date(returnDate) - new Date(departureDate)) / 86400000 < 1
    ) {
      setMaximumHoliday(
        (new Date(returnDate) - new Date(departureDate)) / 86400000
      );
    }
  }, [returnDate, departureDate]);

  useEffect(() => {
    console.log(user);
    if (user?.given_name && user?.family_name) {
      setName(`${user.given_name} ${user.family_name}`);
    }
  }, [isLoading]);

  // useEffect(() => {

  // }, [confirmEmailAddress, email]);

  // State for managed dates

  // Form outputs strings so we need to transform the data properly
  const transformFormToDataTypes = () => {
    const departureDateTransform = new Date(departureDate);
    const returnDateeTransform = new Date(returnDate);
    const minimalHolidayTransform = Number(minimalHoliday);
    const maximumHolidayTransform = Number(maximumHoliday);
    let requiredDateStartTransform;
    let requiredDateEndTransform;
    if (requiredDateStart && requiredDateEnd) {
      requiredDateStartTransform = new Date(requiredDateStart);
      requiredDateEndTransform = new Date(requiredDateEnd);
    }
    return {
      departureDateTransform,
      returnDateeTransform,
      minimalHolidayTransform,
      maximumHolidayTransform,
      requiredDateStartTransform,
      requiredDateEndTransform,
    };
  };

  // Makes sure the code is set correctly for API consumption
  const formValidation = async ({
    departureDateTransform,
    returnDateeTransform,
    minimalHolidayTransform,
    maximumHolidayTransform,
    requiredDateStartTransform,
    requiredDateEndTransform,
  }) => {
    // Validation that's needed to be completed
    // 1) Max Holiday needs to be greater than or equal to minimal holiday
    // 2) Return Date needs to be greater than or equal to departure date
    // 3) RequiredDateEnd needs to be greater than or equal to RequiredDateStart
    // const emailChecker = await fetch(
    //   `${
    //     process.env.NEXT_PUBLIC_LOCALHOST || "https://skyscannerplusweb.herokuapp.com"
    //   }/api/users/check-email-address/`
    // );
    console.log("Checking if validation can move on");
    console.log(+maximumHoliday >= +minimalHoliday);
    if (
      maximumHolidayTransform >= minimalHolidayTransform &&
      (requiredDateEndTransform > requiredDateStartTransform ||
        requiredDateStartTransform === undefined ||
        requiredDateEndTransform === undefined) &&
      returnDateeTransform > departureDateTransform &&
      // name.length > 0 &&
      ref.length > 0 &&
      (user?.sub ?? email.length > 0) &&
      (user?.sub ? user.sub : email) &&
      returnDate > departureDate &&
      +maximumHoliday >= +minimalHoliday
    ) {
      console.log("Validation successful");
      if (user?.sub) {
        var payload = {
          user: {
            name: name,
            fingerPrintId: data.visitorId,
            sub: user.sub,
          },
          created: new Date(),
          ref: ref,
          currency: {
            fullCurrency: currency.fullCurrency || "GBP - £",
            currencyCode: currency.currencyCode || "GBP",
          },
          flights: {
            departure: departure,
            arrival: arrival,
            returnFlight: returnFlight,
          },
          dates: {
            departureDate: departureDateTransform,
            returnDate: returnDateeTransform,
            minimalHoliday: minimalHolidayTransform,
            maximumHoliday: maximumHoliday,
            requiredDayStart: requiredDateStartTransform,
            requiredDayEnd: requiredDateEndTransform,
            weekendOnly: weekendOnly,
          },
          status: "created",
          workerPID: 0,
          isBeingScanned: false,
          scannedLast: 0,
          nextScan: new Date(),
          alertPrice,
          alertPriceFired: false,
        };
      } else {
        var payload = {
          user: {
            name: name,
            email: email,
            fingerPrintId: data.visitorId,
          },
          created: new Date(),
          ref: ref,
          currency: {
            fullCurrency: currency.fullCurrency || "GBP - £",
            currencyCode: currency.currencyCode || "GBP",
          },
          flights: {
            departure: departure,
            arrival: arrival,
            returnFlight: returnFlight,
          },
          dates: {
            departureDate: departureDateTransform,
            returnDate: returnDateeTransform,
            minimalHoliday: minimalHolidayTransform,
            maximumHoliday: maximumHoliday,
            requiredDayStart: requiredDateStartTransform,
            requiredDayEnd: requiredDateEndTransform,
            weekendOnly: weekendOnly,
          },
          workerPID: 0,
          isBeingScanned: false,
          scannedLast: 0,
          nextScan: new Date(),
          status: "created",
          alertPrice,
          alertPriceFired: false,
        };
      }

      if (
        requiredDateStartTransform === undefined ||
        requiredDateEndTransform === undefined
      ) {
        console.log(payload);
        delete payload.dates.requiredDayStart;
        delete payload.dates.requiredDayEnd;
        console.log(`Changes have been made`);
      }
      // Do we have localStorage with ref. This means at least 1
      // if (JSON.parse(localStorage.getItem("ref"))) {
      //   console.log(JSON.parse(localStorage.getItem("ref")));
      //   const localRef = JSON.parse(localStorage.getItem("ref"))
      //   // Is it exactly 1?
      //   if (localRef.length === 1) {
      //     // Make sure we aren't resubmitting the same flight
      //     if (localRef[0] === ref) {
      //       console.log("No need to add the same flight")
      //       return { status: false };
      //     } else {
      //       localRef.push(ref)
      //       console.log(localRef)
      //       localStorage.setItem("ref", JSON.stringify(localRef))
      //       return { payload, status: true };
      //     }
      //   } else {
      //     console.log("You already have two flights")
      //     return { status: false };
      //   }
      // } else {
      //   localStorage.setItem("ref", JSON.stringify([ref]));
      let fingerPrintResponse;
      if (process.env.NEXT_PUBLIC_BACKEND_LOCAL_API) {
        fingerPrintResponse = await fetch(
          `http://${process.env.NEXT_PUBLIC_BACKEND_LOCAL_API}/nest-v1/user-flights/${data.visitorId}/fingerprint-today`
        );
      } else {
        fingerPrintResponse = await fetch(
          // "https://skyscannerplusweb.herokuapp.com/api/users/create/",
          // "http://localhost:8001/api/users/create/",
          `${
            process.env.NEXT_PUBLIC_HTTP_LOCAL_WEB ||
            "https://skyscannerplusweb.herokuapp.com"
          }/api/users/check-flight-amount-by-fingerprintid/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ fingerPrintId: data.visitorId }),
            cors: "no-cors",
          }
        );
      }
      const fingerPrintData = await fingerPrintResponse.json();

      if (user && user.sub === "google-oauth2|107234380339450042425") {
        console.log("Hi hi");
      } else if (fingerPrintData > 2) {
        console.log("No more flights for today");
        return { status: false };
      }
      console.log(payload);
      // Payload is ready
      return { payload, status: true };
      // }
      // localStorage.setItem("email", JSON.stringify(email));
    } else {
      console.table(
        name.length > 0,
        ref.length > 0,
        email.length > 0,
        email === confirmEmailAddress,
        returnDate > departureDate,
        +maximumHoliday >= +minimalHoliday
      );
      console.log(`Maximum Holiday is: ${maximumHoliday}`);
      console.log(`Minimal Holiday is: ${minimalHoliday}`);
      console.log("Something is missing from the form. Please check the form");
      // toast("Please check the form", {
      //   position: "top-right",
      //   autoClose: 5000,
      //   hideProgressBar: false,
      //   closeOnClick: true,
      //   pauseOnHover: true,
      //   draggable: true,
      //   progress: undefined,
      // });
      return { status: false };
    }
  };

  const validateAndSend = async () => {
    const testObject = transformFormToDataTypes();
    const { payload, status } = await formValidation(testObject);
    console.log(payload);
    if (status) {
      let response;
      if (process.env.NEXT_PUBLIC_BACKEND_LOCAL_API) {
        console.log("########### Alan we're making something here ###################")
        try {
          console.log(email)
          const sendPayload = {
            payload: {
              ...payload
            },
            userInformation: {
              fingerprint: data.visitorId,
              email: email || null,
              user: {
                sub: user?.sub || null,
                auth0_email: user?.email || null,
              },
            },
          };
          console.log(sendPayload)
          response = await fetch(
            `http://${process.env.NEXT_PUBLIC_BACKEND_LOCAL_API}/nest-v1/user-flights/typeorm`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(sendPayload),
              cors: "no-cors",
            }
          );
        } catch (error) {
          console.log(error);
        }
      } else {
        console.log("########### Something is not right ###################")

        try {
          response = await fetch(
            // "https://skyscannerplusweb.herokuapp.com/api/users/create/",
            // "http://localhost:8001/api/users/create/",
            `${
              process.env.NEXT_PUBLIC_BACKEND_LOCAL_API ||
              "https://skyscannerplusweb.herokuapp.com"
            }/api/users/create/`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(payload),
              cors: "no-cors",
            }
          );
        } catch (error) {
          console.log(error);
        }
      }
      toast("✅ The flight has been added!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log(currency);
      Router.push(
        {
          pathname: "/confirmation",
          query: {
            name,
            ref,
            email,
            returnFlight: returnFlight,
            departure,
            arrival,
            departureDate,
            returnDate,
            minimalHoliday,
            maximumHoliday,
            currency: currency.fullCurrency,
          },
        },
        "/confirmation"
      );
    } else {
      ("We didn't make a call to the server as a result of validation failure");
      toast.error("Error with the form!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      toast.error(
        `Missing: 
      ${email.length <= 0 ? "email  " : ""}
      ${!departure ? "departure " : ""}
      ${!arrival ? "arrival " : ""}
      ${!minimalHoliday ? "minimal holiday " : ""}
      ${!maximumHoliday ? "maximum holiday" : ""}`,
        {
          position: "top-right",
          autoClose: 15000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    }
  };

  // Style function in relation to confirm email address
  const successOrFailure = (result) => {
    if (result === true) {
      setSuccessful(true);
      setFailed(false);
    } else {
      setSuccessful(false);
      setFailed(true);
    }
  };

  function ValidateEmail(inputText) {
    if (inputText.length < 5) return false;
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    console.log(inputText);
    if (inputText.match(mailformat)) {
      toast.info("Valid Email Address", {
        position: "top-right",
        autoClose: 1250,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return true;
    } else {
      toast.error("Invalid Email Address", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return false;
    }
  }

  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>Create Flight</title>
          <meta name="description" content="Create a flight" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.titleDiv}>
          <h1 className={styles.title}>
            Create a <span className={styles.flight}>Flight</span>{" "}
          </h1>
        </div>
        {!user && (
          <>
            <EmailOrLoginButtons
              ValidateEmail={ValidateEmail}
              setEmail={setEmail}
              email={email}
            />
          </>
        )}

        <main className={styles.main}>
          <div>
            {/* <form> */}
            <div className={styles.inputForm}>
              <h3>General Details</h3>
              <div className={styles.inputCollection}>
                <div>
                  <label htmlFor="reference">Reference</label>
                  <input
                    style={{ backgroundColor: "#d1d0d0" }}
                    disabled
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    type="text"
                    placeholder="reference"
                  />
                </div>
                {/* {!user && (
                  <>
                    <div>
                      <label htmlFor="email">Email Address</label>
                      <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => ValidateEmail(e.target.value)}
                        type="email"
                        placeholder="email address"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirmEmail">Confirm Email</label>
                      <input
                        value={confirmEmailAddress}
                        onChange={(e) => {
                          confirmSetEmailAddress(e.target.value);
                        }}
                        onBlur={(e) => {}}
                        type="email"
                        placeholder="confirm email"
                        id={`${successful === true ? "success" : "failed"}`}
                      />
                    </div>
                  </>
                )} */}

                <div>
                  <label htmlFor="returnFlight">Return/One Way</label>
                  <select
                    // disabled
                    value={returnFlight}
                    // onChange={(e) => setRequiredDateEnd(e.target.value)}
                    onChange={(e) => {
                      if (e.target.value === "true") {
                        setReturnFlight(true);
                      } else {
                        setReturnFlight(false);
                        setMinimalHolday(1);
                        setMaximumHoliday(1);
                      }
                    }}
                  >
                    <option value="true">Return</option>
                    <option value="false">One Way</option>
                  </select>
                </div>
              </div>
            </div>
            <div className={styles.inputForm}>
              <h3>Flight information</h3>
              <div className={styles.inputCollection}>
                <div>
                  {" "}
                  <label id="departureInput" htmlFor="departure">
                    Departure
                  </label>
                  {/* Departure Dropdown */}
                  <div className={styles.dropdown}>
                    <input
                      className={styles.dropbtn}
                      id={`${departureMatch === true && "success"}`}
                      value={departure}
                      onClick={(e) => {
                        if (Mobile()) {
                          // alert("Mobile detected")
                          console.log(Mobile());
                          e.target.parentNode.previousSibling.scrollIntoView(
                            true
                          );
                        }
                      }}
                      onChange={(e) => setDeparture(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value.length > 2) {
                          let departureChecker = [];
                          for (let element of departureAirportFiltered) {
                            console.log("On blur started");
                            console.log(`What is departure: ${departure}`);
                            console.log(
                              `Comparison checker = ${element.skyscannerNameWithCode} - ${departure}`
                            );
                            if (element.skyscannerNameWithCode === departure) {
                              console;
                              departureChecker.push(true);
                            }
                            console.log(departureChecker);
                            console.log(
                              `is departureChecker.length > 0 = ${
                                departureChecker.length > 0
                              }`
                            );
                          }
                          console.log(departureChecker.length === 0);
                          if (departureChecker.length === 0) {
                            console.log("hello first thing added");
                            console.log("Now what is departure: " + departure);
                            setDeparture(
                              departureAirportFiltered[0].skyscannerNameWithCode
                            );
                          }
                        }
                      }}
                      type="text"
                      placeholder="departure"
                    />
                    <div className={styles.dropdownContent}>
                      <AirportList
                        text={departure}
                        state={setDeparture}
                        setAirportFiltered={setDepartureAirportFiltered}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="arrival">Arrival</label>
                  <div className={styles.dropdown}>
                    <input
                      id={`${arrivalMatch === true && "success"}`}
                      className={styles.dropbtn}
                      value={arrival}
                      onClick={(e) => {
                        if (Mobile()) {
                          console.log(Mobile());
                          document
                            .getElementById("departureInput")
                            .scrollIntoView(true);
                        }
                      }}
                      onChange={(e) => setArrival(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value.length > 2) {
                          let arrivalChecker = [];
                          for (let element of arrivalAirportFiltered) {
                            console.log("On blur started");
                            console.log(`What is departure: ${arrival}`);
                            console.log(
                              `Comparison checker = ${element.skyscannerNameWithCode} - ${arrival}`
                            );
                            if (element.skyscannerNameWithCode === arrival) {
                              console;
                              arrivalChecker.push(true);
                            }
                            console.log(arrivalChecker);
                            console.log(
                              `is departureChecker.length > 0 = ${
                                arrivalChecker.length > 0
                              }`
                            );
                          }
                          // console.log(departureChecker.length === 0);
                          if (arrivalChecker.length === 0) {
                            console.log("hello first thing added");
                            console.log("Now what is departure: " + departure);
                            setArrival(
                              arrivalAirportFiltered[0].skyscannerNameWithCode
                            );
                          }
                        }
                      }}
                      type="text"
                      placeholder="arrival"
                    />
                    <div className={styles.dropdownContent}>
                      <AirportList
                        text={arrival}
                        state={setArrival}
                        setAirportFiltered={setArivalAirportFiltered}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label htmlFor="departureDate">Earliest Departure Date</label>
                  <input
                    className={styles.dateInput}
                    value={departureDate}
                    onChange={(e) => {
                      setDepartureDate(e.target.value);
                      if (returnDate < departureDate) {
                        setReturnDate(e.target.value);
                      }
                      // setRequiredDateStart(e.target.value);
                      // setRequiredDateEnd(e.target.value);
                    }}
                    type="date"
                    placceholder="departure date"
                    min={new Date().toISOString().slice(0, 10)}
                    // max={returnDate}
                  />
                </div>
                <div>
                  <label htmlFor="returnDate">Latest Return Date</label>
                  <input
                    className={styles.dateInput}
                    value={returnDate}
                    onChange={(e) => {
                      setReturnDate(e.target.value);
                      // setRequiredDateEnd(e.target.value);
                    }}
                    type="date"
                    placeholder="return date"
                    min={departureDate}
                  />
                </div>
                <div>
                  <label htmlFor="minimalHoliday">
                    Minimal Holiday Duration
                  </label>
                  <input
                    disabled={returnFlight === true ? false : true}
                    style={{
                      backgroundColor: `${
                        returnFlight === true ? "white" : "rgb(209, 208, 208)"
                      }`,
                    }}
                    value={returnFlight === false ? 1 : minimalHoliday}
                    onClick={(e) => {
                      setMinimalHolidayPrevious(minimalHoliday);
                      setMinimalHolday("");
                    }}
                    onChange={(e) => setMinimalHolday(e.target.value)}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        console.log("it's true as fuck");
                        setMinimalHolday(minimalHolidayPrevious);
                      }
                      if (
                        +e.target.value >
                        (new Date(returnDate) - new Date(departureDate)) /
                          86400000
                      ) {
                        setMinimalHolday(
                          (new Date(returnDate) - new Date(departureDate)) /
                            86400000
                        );
                      }
                    }}
                    type="number"
                    placeholder="minimal holiday: days"
                  />
                </div>
                <div>
                  <label htmlFor="maximumHoliday">
                    Maximum Holiday Duration
                  </label>
                  <input
                    disabled={returnFlight === true ? false : true}
                    style={{
                      width: "190px",
                      backgroundColor: `${
                        returnFlight === true ? "white" : "rgb(209, 208, 208)"
                      }`,
                    }}
                    value={returnFlight === false ? 1 : maximumHoliday}
                    onClick={(e) => {
                      setMaximumHolidayPrevious(maximumHoliday);
                      setMaximumHoliday("");
                    }}
                    onChange={(e) => setMaximumHoliday(e.target.value)}
                    onBlur={(e) => {
                      if (e.target.value === "") {
                        console.log("it's true as fuck");
                        setMaximumHoliday(maximumHolidayPrevious);
                      } else {
                        +e.target.value <= minimalHoliday
                          ? setMaximumHoliday(minimalHoliday)
                          : setMaximumHoliday(e.target.value);
                        if (
                          +e.target.value >
                          (new Date(returnDate) - new Date(departureDate)) /
                            86400000
                        ) {
                          console.log("LOOK HERE ALAN");
                          setMaximumHoliday(
                            (new Date(returnDate) - new Date(departureDate)) /
                              86400000
                          );
                        }
                      }
                    }}
                    type="number"
                    placeholder="maximum holiday: days"
                    min={minimalHoliday}
                    max={
                      (new Date(returnDate) - new Date(departureDate)) /
                      86400000
                    }
                  />
                </div>
              </div>
            </div>
            <div className={styles.inputForm}>
              <h3>Special Information (Optional)</h3>
              <div className={styles.inputCollection}>
                <div>
                  <label htmlFor="requiredDateBeginning">Reserved Start</label>
                  <input
                    className={styles.dateInput}
                    value={requiredDateStart}
                    onChange={(e) => {
                      setRequiredDateStart(e.target.value);
                      if (requiredDateEnd < requiredDateStart) {
                        setRequiredDateEnd(requiredDateStart);
                      }
                    }}
                    type="date"
                    placceholder="departure date"
                    min={departureDate}
                    // max={requiredDateEnd}
                  />
                </div>
                <div>
                  <label htmlFor="requiredDateEnding">Reserved End</label>
                  <input
                    className={styles.dateInput}
                    value={requiredDateEnd}
                    onChange={(e) => setRequiredDateEnd(e.target.value)}
                    type="date"
                    placeholder="return date"
                    min={requiredDateStart}
                    max={returnDate}
                  />
                </div>
                <div>
                  <label htmlFor="weekendOnly">Weekend Only</label>
                  <select
                    value={requiredDateEnd}
                    // onChange={(e) => setRequiredDateEnd(e.target.value)}
                    placeholder="return date"
                    onChange={(e) => {
                      e.target.value === "true"
                        ? setWeekendOnly(true)
                        : setWeekendOnly(false);
                    }}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </div>
                {/* Select */}
                <div>
                  <CurrencySelector setCurrency={setCurrency} />
                </div>
                <div>
                  <label htmlFor="alertPrice">Alert Price</label>
                  <input
                    value={alertPrice}
                    onChange={(e) => setAlertPrice(e.target.value)}
                    type="number"
                    placeholder="Price for Alert"
                  />
                </div>
              </div>
            </div>
            <input
              style={{ marginTop: "30px" }}
              type="submit"
              onClick={validateAndSend}
            />
            {/* </form> */}
          </div>
        </main>
      </div>
    </Layout>
  );
}
