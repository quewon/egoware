window.onload = function() {
  init();
};

var _input = document.getElementById("input");
var _output = document.getElementById("output");
var _app = document.getElementById("app");
var inputText = "";
var inputHistory = [""];
var inputHistoryIndex = 0;
var _inputWrapper = document.getElementById("input_wrapper");
var _caret = document.getElementById("caret");
var caretTimer = 0;
var caretIdle = false;
var app;    var mode;   var respondingTo;

function init() {
  document.addEventListener("keydown", function(e) {
    e.preventDefault();

    key(e.key, e.metaKey);
  });
  document.addEventListener("keyup", function(e) {
    e.preventDefault();

    caretIdle = true;
  });
  window.onblur = function() {
    caretIdle = true;
  };
  update();

  switchApp(Config.startupApp);
}

function input(command) {
  command = command.toLowerCase().trim();
  let sufs = command.split(" ");
  sufs.shift();
  Apps[app].input(command.split(" ")[0], sufs, command);
}

function switchApp(name) {
  app = name;
  mode = "CMD";
  while (_output.childElementCount > 0) {
    _output.removeChild(_output.lastChild);
  }
  output(Apps[app].intro);
  if (app != "main") {
    if (appHistory.includes(app)) appHistory.splice(appHistory.indexOf(app), 1);
    appHistory.unshift(app);
    _app.textContent = app;
  } else {
    _app.textContent = "";
  }
  if ('startup' in Apps[app]) Apps[app].startup();
}

function key(k, meta) {
  // metakey
  if (meta) {
    switch (k) {
      case "v":
        navigator.clipboard.readText().then(function(clipText) {
          inputText += clipText;
          key("");
        });
        break;
    }
  } else {
    if (Config.validInput.includes(k)) {
      // inputText += k.toUpperCase();
      inputText += k;
    } else {
      switch (k) {
        case "Backspace":
          inputText = inputText.slice(0, -1);
          break;
        case "Enter":
          if (inputText.trim() != "") {
            input(inputText);

            if (inputText != inputHistory[inputHistory.length - 2]) {
              inputHistory[inputHistory.length - 1] = inputText;
              inputHistory.push("");
            }

            inputHistoryIndex = inputHistory.length - 1;
            inputText = "";
          } else {
            inputText = "";
          }
          break;
        case "ArrowUp":
          scrollHistory(-1);
          break;
        case "ArrowDown":
          scrollHistory(1);
          break;
        case "Escape":
          inputText = "";
          break;
      }
    }
  }

  _input.textContent = inputText;

  while ((isOverflown(_inputWrapper))) {
    var text = _input.textContent;
    _input.textContent = text.substring(1);
  }

  //highlight commands
  let words = inputText.split(" ");
  for (let i in Apps[app].commands) {
    let cmd = Apps[app].commands[i];
    if (words.includes(cmd)) {
      _input.innerHTML = _input.innerHTML.replace(cmd, "<em>"+cmd+"</em>");
    }
  }

  if (caretIdle) {
    _caret.classList.remove("idle");
    caretTimer = 0;
    caretIdle = false;
  }

  if (inputText.trim() != "") {
    _app.classList.add("hidden");
  } else {
    _app.classList.remove("hidden");
  }
}

function output(content, typeContent) {
  typeContent = typeContent || false;

  if (Array.isArray(content)) {
    content = content[Math.random() * content.length | 0];
  }

  var div = document.createElement("div");
  _output.prepend(div);

  if (!typeContent) {
    div.innerHTML = content;
  } else {
    type(div, content);
  }

  while (_output.childElementCount > Config.maxOutput) {
    _output.removeChild(_output.lastChild);
  }
}

function scrollHistory(value) {
  inputHistoryIndex += value;

  if (inputHistoryIndex < 0) inputHistoryIndex = 0;
  else if (inputHistoryIndex >= inputHistory.length) inputHistoryIndex = inputHistory.length - 1;

  inputText = inputHistory[inputHistoryIndex];
  key("");
}

function update() {
  if (caretIdle) {
    if (caretTimer > 10) {
      _caret.classList.add("idle");
    }

    caretTimer++;
  }

  window.requestAnimationFrame(update);
}