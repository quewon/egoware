var Config = {
  validInput: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!@#$%^&*()-_+=<,>.:;\"'?/{[}]|~` ",
  maxOutput: 15,
  typeSpeed: 2,
};

function isOverflown(element) {
  return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}

var typing;
function type(element, content, s) {
  typing = true;
  s = s || Config.typeSpeed;

  element.innerHTML = "";

  let stripped = content.replace(/<br>/g, "¶");
  stripped = stripped.split(/(?:\/b>)/g);

  if (stripped.length==1) {
    element.innerHTML = stripped[0];
    stripped[0] = element.textContent;
    element.innerHTML = "";
    stripped = stripped[0].split("");
  } else if (stripped.length > 1) {
    element.innerHTML = stripped[1];
    stripped[1] = element.textContent;
    element.innerHTML = "";
    stripped[1] = stripped[1].split("");
    stripped = stripped.flat();
  }

  var speed = s;
  var counter = 0;
  var charcount = 0;
  var pause = 0;
  animate();

  function animate() {
    if (pause > 0) {
      pause--;
      requestAnimationFrame(animate);
      return;
    }
    if (counter==speed) {
      counter = 0;
      let char = stripped[charcount];

      switch (char) {
        case ".":
        case ":":
        case "!":
        case "?":
          pause = 12+s;
          break;
        case ",":
          pause = 5*s;
          break;
        case "¶":
          char = "<br>";
          pause = 2*s;
      }

      element.innerHTML += char;
      charcount++;
    }
    if (charcount==stripped.length) {
      element.innerHTML = content;
      typing = false;
    } else {
      counter++;
      requestAnimationFrame(animate);
    }
  }
}