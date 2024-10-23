const generateString = (
  length,
  useAlphabeticCharacters = true,
  useNumericCharacters = true
) => {
  var result = "";
  var characters = "";
  if (useAlphabeticCharacters) {
    characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  }
  if (useNumericCharacters) {
    characters = characters + "0123456789";
  }
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result + "-" + Date.now();
};
module.exports = generateString;
