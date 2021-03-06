const colorBg = ["#f4f0ff", "#0d0c11"];
const fontColor = ["#140d33", "#f8faff"];
const colorPurple = ["#420dff", "#0087ff"];
const colorPurpleTransparent = ["#420dff33", "#000"];
const colorPurpleTransparentC = ["#410dff12", "#44688812"];
const colorViolet = ["#a60dff", "#9700ff"];
const colorWhite = ["#fff", "#f8faff13"];
const colorWhiteC = ["#fff", "#000"];

function changesTheme(flag) {
  var root = document.documentElement.style;
  let index = Number(flag);

  root.setProperty("--color-bg", colorBg[index]);
  root.setProperty("--font-color", fontColor[index]);
  root.setProperty("--color-purple", colorPurple[index]);
  root.setProperty("--color-purple-transparent", colorPurpleTransparent[index]);
  root.setProperty(
    "--color-purple-transparent-c",
    colorPurpleTransparentC[index]
  );
  root.setProperty("--color-violet", colorViolet[index]);
  root.setProperty("--color-white", colorWhite[index]);
  root.setProperty("--color-white-c", colorWhiteC[index]);
}
export default changesTheme;
