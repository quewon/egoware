var appHistory = ["mailbox", "3p3o"];

var Apps = {
  "egoware": {
    input: function(command) {
      switch (command) {
        case "1":
          window.location.href = "v1.0.html";
          break;
        default:
          output("you gotta tell me the number of the version you want.");
          break;
      }
    },
    intro: "which version of egoware do you wanna see?<br><ol><li>egoware v1.0</li></ol>",
    commands: [],
  },
};