import currencyList from "../constant/currencyStuff";

export default function CurrencySelector({ setCurrency }) {
  return (
    <>
      <label htmlFor="exampleRecipientInput">Currency</label>
      <select
        className="u-full-width"
        id="exampleRecipientInput"
        onChange={(e) => {
          const {  options, selectedIndex } = e.target;
          console.log(options[selectedIndex].text)
          setCurrency({
            fullCurrency: options[selectedIndex].text,
            currencyCode: e.target.value,
          });
        }}
      >
        {currencyList.map((el) => {
          return <option key={el.currencyCode} value={el.currencyCode}>{el.fullName}</option>;
        })}
      </select>
    </>
  );
}
