export function nepaliRupeesFormat(num) {
  const parts = num.toString().split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] ? "." + parts[1] : "";

  // Updated regex to match the Indian grouping pattern: 3 digits, then groups of 2
  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))|(?=(\d{2})+(?=\d{5}$))/g, ",");

  return formattedIntegerPart + decimalPart;
}
