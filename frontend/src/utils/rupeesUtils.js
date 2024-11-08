export function nepaliRupeesFormat(num) {
  const parts = num.toString().split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] ? "." + parts[1] : "";

  const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))|(?=(\d{2})+(?=\d{5}$))/g, ",");

  return formattedIntegerPart + decimalPart;
}
