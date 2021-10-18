const admin = require("../config/firebase");

function notification({ title, body }) {
  const message = {
    data: {
      title: title,
      body: body,
    },
    topic: "monitor",
  };
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
}

module.exports = notification;
