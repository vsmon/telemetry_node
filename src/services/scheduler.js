const cron = require("node-cron");

const scheduler = (schedule, job) => {
  if (!cron.validate(schedule)) {
    return console.log("Expressao de agendamento invalida");
  }
  const task = cron.schedule(schedule, job, {
    scheduled: false,
    timezone: "America/Sao_Paulo",
  });

  task.start();
};

module.exports = scheduler;