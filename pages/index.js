import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ShortUniqueId from "short-unique-id";
import Mobile from "is-mobile";
import { useVisitorData } from '@fingerprintjs/fingerprintjs-pro-react'

// Component List
import Layout from "../components/Layout";
import AirportList from "../components/AirportList";
import singleNameCombined from "../constant/singleNameCombined";

const uid = new ShortUniqueId({ length: 10 });

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Confirm Email Address
  const [confirmEmailAddress, confirmSetEmailAddress] = useState("");
  const [ref, setRef] = useState(uid().toUpperCase());
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

  const [departureAirportFiltered, setDepartureAirportFiltered] = useState([]);
  const [arrivalAirportFiltered, setArivalAirportFiltered] = useState([]);

  const {data} = useVisitorData();
  console.log(data)

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
    if (
      maximumHolidayTransform >= minimalHolidayTransform &&
      (requiredDateEndTransform > requiredDateStartTransform ||
        requiredDateStartTransform === undefined ||
        requiredDateEndTransform === undefined) &&
      returnDateeTransform > departureDateTransform &&
      name.length > 0 &&
      ref.length > 0 &&
      email.length > 0 &&
      email === confirmEmailAddress &&
      returnDate > departureDate &&
      maximumHoliday >= minimalHoliday
    ) {
      console.log("Validation successful");
      const payload = {
        user: {
          name: name,
          email: email,
        },
        ref: ref,
        flights: {
          departure: departure,
          arrival: arrival,
        },
        dates: {
          departureDate: departureDate,
          returnDate: returnDate,
          minimalHoliday: minimalHolidayTransform,
          maximumHoliday: maximumHoliday,
          requiredDayStart: requiredDateStartTransform,
          requiredDayEnd: requiredDateEndTransform,
          weekendOnly: weekendOnly,
        },
        workerPID: 0,
        isBeingScanned: false,
        scannedLast: 0,
        nextScan: 0,
      };
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
      if (JSON.parse(localStorage.getItem("ref"))) {
        console.log(JSON.parse(localStorage.getItem("ref")));
        const localRef = JSON.parse(localStorage.getItem("ref"))
        // Is it exactly 1?
        if (localRef.length === 1) {
          // Make sure we aren't resubmitting the same flight
          if (localRef[0] === ref) {
            console.log("No need to add the same flight")
            return { status: false };
          } else {
            localRef.push(ref)
            console.log(localRef)
            localStorage.setItem("ref", JSON.stringify(localRef))
            return { payload, status: true };
          }
        } else {
          console.log("You already have two flights")
          return { status: false };
        }
      } else {
        localStorage.setItem("ref", JSON.stringify([ref]));
        console.log(payload);
        // Payload is ready
        return { payload, status: true };
      }
      // localStorage.setItem("email", JSON.stringify(email));
    } else {
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
      try {
        const response = await fetch(
          // "https://skyscannerplusweb.herokuapp.com/api/users/create/",
          // "http://localhost:8001/api/users/create/",
          `${
            process.env.NEXT_PUBLIC_LOCALHOST ||
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
        const data = await response.json();
        console.log(data);
        toast("✅ The flight has been added!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        console.log(error);
      }
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
        <main className={styles.main}>
          <div>
            {/* <form> */}
            <div className={styles.inputForm}>
              <h3>General Details</h3>
              <div className={styles.inputCollection}>
                <div className={styles.individualInput}>
                  {" "}
                  <label htmlFor="name">Name</label>
                  <input
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    type="text"
                    placeholder="name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="reference">Reference</label>
                  <input
                    disabled
                    value={ref}
                    onChange={(e) => setRef(e.target.value)}
                    type="text"
                    placeholder="reference"
                  />
                </div>
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
                    value={minimalHoliday}
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
                    placeholder="minimal holiday"
                  />
                </div>
                <div>
                  <label htmlFor="maximumHoliday">
                    Maximum Holiday Duration
                  </label>
                  <input
                    style={{ width: "200px" }}
                    value={maximumHoliday}
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
                    placeholder="maximum holiday"
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
