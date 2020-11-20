/**
 * This function converts weight in pounds to kg
 * @param {float} poundsValue takes in a value in pounds(lbs)
 * @return {float} Returns single value in kgs
 */
function poundsToKg(poundsValue) {
  return (parseFloat(poundsValue) * 0.45359237).toPrecision(4);
}

/**
 * This function converts weight in kg to pounds
 * @param {float} kgValue takes in a value in kilogram (kg)
 * @return {float} Returns single value in pounds
 */
function kgToPounds(kgValue) {
  return (parseFloat(kgValue) * 2.2046226218).toPrecision(4);
}

/**
 * This function converts the height in feet and inches to centimeters
 * @param {float} feetValue takes in a values (feet)
 * @param {float} inchValue takes in a values (inches)
 * @return {float} height in cm
 */
function feetInchesToCm([feetValue, inchValue]) {
  const newFootValue = parseFloat(feetValue) * 30.48;
  const newInchValue = parseFloat(inchValue) * 2.54;
  return (newFootValue + newInchValue).toPrecision(4);
}

/**
 * This function converts height in cm to meters
 * @param {float} cmValue takes in a value in centimeters (cm)
 * @return {float} Returns single value in meters
 */
function cmToMeters(cmValue) {
  const result = parseFloat(cmValue) / 100.0;
  return result.toPrecision(3);
}

/**
 * This function calculates the BMI
 * @param {float} weight takes in a value in kilogram (kg)
 * @param {float} height takes in a value in meters (kg)
 * @return {Object} Returns bmi and rating value ie. Overweight, Underweight.
 */
function calculateBMI(weight, height) {
  const bmi = parseFloat(weight) / parseFloat(height) ** 2;
  const ratingsMsg =
    'Less than 18.5 = Underweight; Between 18.5 - 24.9 = Healthy Weight; Between 25 - 29.9 = Overweight; Over 30 = Obese';
  let rating;
  if (bmi < 18.5) {
    rating = 'Underweight';
  }
  if (bmi >= 18.5 && bmi <= 25) {
    rating = 'Normal-weight';
  }
  if (bmi >= 25 && bmi < 30) {
    rating = 'Overweight';
  }
  if (bmi >= 30) {
    rating = 'Obese';
  }

  return { bmi: bmi.toPrecision(3), rating, ratingsMsg };
}

const toCamelCase = (str) =>
  str.trim().replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''));

function clean(obj) {
  Object.keys(obj).forEach((key) => {
    if (Object.prototype.toString.call(obj[key])) {
      if (obj[key] === null || obj[key] === undefined) {
        delete obj[key];
      }
    }
  });
}

module.exports = {
  poundsToKg,
  kgToPounds,
  feetInchesToCm,
  cmToMeters,
  calculateBMI,
  toCamelCase,
  clean,
};
