var Addresses = ["me", "myself", "egoware"];

var Apps = {
  "egoware": {
    input: function(command, sufs, fullcommand) {
      if (command == "egoware") {
        switchApp("main");
        return;
      }

      command = fullcommand;

      switch (mode) {
        case "CMD":
          for (let t in D) {
            if (t == command) {
              output(D[t][D[t].length * Math.random() | 0]+" is <em>"+t+"</em>.", true);
              return;
            }
            if (D[t].includes(command)) {
              output(D[R[t]], true);
              return;
            }
          }

          for (let t in R) {
            if (R[t] == command) {
              output("that is a response to <em>"+t+"</em>.", true);
              return;
            }
          }

          // type not found

          output("<i>"+command+"</i>? what is that?", true);
          mode = command;
          break;
        case "RESPONSE":
          if (!(command in D)) D[command] = [command];
          R[respondingTo] = command;
          mode = "CMD";
          output(D[R[command]], true);
          break;
        default:
          if (!(command in D)) D[command] = [];
          D[command].push(mode);

          if (D[command].length < 2) {
            output("i understand. "+mode+" is <em>"+command+"</em>. what should i respond to <em>"+command+"</em> with?", true);
            respondingTo = command;
            mode = "RESPONSE";
          } else {
            output("i understand. "+mode+" is <em>"+command+"</em> like "+D[command][0]+".", true);
            mode = "CMD";
          }
          break;
      }
    },
    intro: "<u>egoware v1.0</u><br>teach me things like greetings and basic phrases!<br>type <em>egoware</em> to exit the application.",
    commands: ["egoware"],
  },

  "main": {
    input: function(command, sufs) {
      switch (command) {
        case "help":
          let cmds = `<em><u>nav</u>igate</em><br>
                      <em><u>pref</u>erences</em>
                      `;
          output(cmds);
          break;
        case "navigate":
        case "nav":
          let suf = sufs[0];
          if (!suf || !(suf in Apps)) {
            let history = "";
            for (let i in appHistory) {
              history += "<li>"+appHistory[i]+"</li>";
            }
            output(`
              in your command, add the name of the application you would like to navigate to.<br>
              recently visited: 
              <ul>`+history+`</ul>
              `)
          } else {
            switchApp(suf)
          }
          break;
        case "preferences":
        case "pref":
          switchApp("preferences");
          break;
        default:
          output("type <em>help</em> for a list of commands.");
          break;
      }
    },
    intro: "welcome to <b><span class='shake'>o</span><span class='shake'>o</span><span class='shake'>g</span><span class='shake'>l</span><span class='shake'>e</span></b>, your all-in-one service for surfing the web.",
    commands: ["help", "navigate", "nav", "preferences", "pref"],
  },

  "preferences": {
    input: function(command, sufs) {
      switch (command) {
        case "pref":
        case "preferences":
          switchApp("main");
          break;
        case "help":
          output("no customizable preferences on this version of oogle!");
          break;
        default:
          output("type <em>help</em> for a list of customizable preferences.");
          break;
      }
    },
    intro: "adjust your oogle system preferences here.<br>type <em><u>pref</u>erences</em> to exit the application.",
    commands: ["preferences", "pref", "help"],
  },

  "mailbox": {
    input: function(command, sufs) {
      let inbox = Apps.mailbox.inbox;
      let suf = sufs[0];

      switch (command) {
        case "help":
          let cmds = `<em>read</em><br>
                      <em>delete</em><br>
                      <em>write</em> to navigate to penmail application.<br>
                      <em>mailbox</em> to exit the application.
                      `;
          output(cmds);
          break;
        case "read":
          if (!inbox[suf-1]) {
            let list = "";
            for (let i in inbox) {
              let mail = inbox[i];
              list += "<li>["+mail.date+"]   "+mail.title + "</li>";
            }
            if (list == "") list = "empty";
            output(`
              in your command, add the number of the letter you would like to read.<br>
              inbox:
              <ol>`+list+`</ol>
              `);
          } else {
            let mail = inbox[suf-1];
            let content = "<i>from:</i>&nbsp;&nbsp;&nbsp;&nbsp;"+mail.sender+"<br><span class='mail'>"+mail.content+"</span>";
            if (mail.title.trim() != "") content = "<i>title:</i>&nbsp;&nbsp;&nbsp;"+mail.title+"<br>"+content;
            output(content);
          }
          break;
        case "write":
          switchApp("penmail");
          break;
        case "delete":
          if (!inbox[suf-1]) {
            let list = "";
            for (let i in inbox) {
              let mail = inbox[i];
              list += "<li>["+mail.date+"]   "+mail.title + "</li>";
            }
            output(`
              in your command, add the number of the letter you would like to delete.<br>
              inbox:
              <ol>`+list+`</ol>
              `);
          } else {
            Apps.mailbox.bin.push(inbox[suf-1]);
            inbox.splice(suf-1, 1);
            output("letter deleted.");
          }
          break;
        case "mailbox":
          switchApp("main");
          return;
          break;
        default:
          output("type <em>help</em> for a list of commands.");
          break;
      }
    },
    intro: "your very own digital mailbox.<br>type <em>mailbox</em> to exit the application.",
    commands: ["mailbox", "help", "read", "write", "delete"],
    inbox: [],
    bin: [],
  },

  "penmail": {
    input: function(command, sufs, fullcommand) {
      let mail = Apps.penmail.mail;

      switch (command) {
        case "penmail":
          switchApp("main");
          return;
          break;
        case "restart":
          mail.content = "<i>this letter left empty.</i>";
          output("start typing out your letter.");
          mode = "CMD";
          return;
          break;
        case "seal":
          mode = "RECEIVER";
          output("letter sealed. who are you sending this letter to?");
          return;
          break;
      }

      switch (mode) {
        case "CMD":
          if (mail.content == "<i>this letter left empty.</i>") {
            mail.content = fullcommand;
          } else {
            _output.removeChild(_output.firstChild);
            mail.content += "<br>"+fullcommand;
          }
          output("<span class='mail'>"+mail.content+"</span>");
          break;
        case "RECEIVER":
          if (!command || !Addresses.includes(command)) {
            output(`
              type the oogle mailbox address you'd like to send this letter to.<br>
              otherwise, type 'me' or 'myself' to send it to yourself.<br>
              `);
          } else {
            if (command == "me" || command == "myself") {
              mail.receiver = "you";
            } else {
              mail.receiver = command;
            }

            output("what would you like to title this letter?");
            mode = "TITLE";
          }
          break;
        case "TITLE":
          mail.title = fullcommand;
          output(mail.receiver+" received your letter!");
          if (mail.receiver == "you") {
            Apps.mailbox.inbox.push(mail);
          }
          Apps.penmail.mail = new Mail("you", "", "", "");
          mode = "CMD";
          break;
      }
    },
    intro: "start typing out your letter.<br>type <em>seal</em> to finalize it.<br><em>restart</em> to start over from scratch.<br><em>penmail</em> to exit the application.",
    startup: function() {
      Apps.penmail.mail = new Mail("you", "", "", "");
    },
    mail: {},
    commands: ["penmail", "restart", "seal"],
  },

  "3p3o": {
    input: function(command, sufs) {
      switch (command) {
        case "3p3o":
          switchApp("main");
          break;
        case "help":
          output("<em>play</em><br><em>save</em>");
          break;
        case "play":
          if (!Apps["3p3o"].saved[sufs[0]-1]) {
            let list = "";
            let saved = Apps["3p3o"].saved;
            for (let i in saved) {
              let track = saved[i];
              list += "<li>"+track+"</li>";
            };
            if (list == "") list = "empty";
            output(`
              in your command, add the number of the track you would like to play.<br>
              saved tracks:
              <ol>`+list+`</ol>
              `);
          } else {
            Apps["3p3o"].track = Apps["3p3o"].saved[sufs[0]-1];
            output("now playing <i>"+Apps["3p3o"].track+"</i>.");
          }
          break;
        case "save":
          if (!Apps["3p3o"].track) {
            output("can't save a track when it's not playing.");
          } else if (Apps["3p3o"].saved.includes(Apps["3p3o"].track)) {
            output("track already saved!")
          } else {
            Apps["3p3o"].saved.push(Apps["3p3o"].track);
            output("<i>"+Apps["3p3o"].track+"</i> saved to your saved tracks.<br>type <em>play "+Apps["3p3o"].saved.length+"</em> to replay track.");
          }
          break;
        default:
          output("type <em>help</em> for a list of commands.");
          break;
      }
    },
    startup: function() {
      let types = Object.keys(D);
      let type = null;

      if (types.length > 0) {
        type = types[Math.random() * types.length | 0];
      }

      Apps["3p3o"].track = type;

      // play music
      if (type) {
        output("now playing: "+Apps["3p3o"].track);
      } else {
        output("no tracks playing.");
      }
    },
    track: null,
    saved: [],
    intro: "you're listening to 3p3o.<br>type <em>3p3o</em> to exit the application.",
    commands: ["help", "3p3o", "play", "save"],
  },
};

class Mail {
  constructor(sender, receiver, content, title) {
    this.sender = sender || "you";
    this.receiver = receiver || "you";
    this.content = content || "<i>this letter left empty.</i>";
    let date = new Date();
    this.date = date.getFullYear()+"."+date.getMonth()+"."+date.getDate();
    this.title = title || "";
  }
}