const fetch = require("node-fetch");
const scheduler = require("../services/scheduler.js");
/* 
Allowed fields
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
Allowed values
field	value
  *   all
second	0-59
minute	0-59
hour	0-23
day of month	1-31
month	1-12 (or names)
day of week	0-7 (or names, 0 or 7 are sunday)
*/

const schedule = "*/15 * * * * *"; //Executa de 15 em 15 segundos
const scheduleGetTelemetry = "0 0 */1 * * *"; //Executa de 1 em 1 hora
const scheduleNotifyTempCpu = "0 0 */10 * * *"; //Executa de 10 em 10 horas
const scheduleAlertTemp = "0 */5 * * * *"; //Executa de 5 em 5 minutos
const scheduleDDNS = "0 */5 * * * *"; //Executa de 5 em 5 minutos
const schedulePoweroffDisplay = "0 */4 * * * *"; //Executa de 5 em 5 minutos

//scheduler(schedule, () => TelemetryController.store2());
scheduler(scheduleGetTelemetry, async () => {
  const response = await fetch(
    `http://localhost:3000/telemetry?token=${process.env.TOKEN}`,
    {
      method: "POST",
    }
  );
  const json = await response.json();
  console.log(json);
});

/* Schedule alert temperature */
scheduler(scheduleAlertTemp, async () => {
  const response = await fetch(
    `http://localhost:3000/temperature?token=${process.env.TOKEN}`,
    {
      method: "GET",
    }
  );
  const json = await response.json();
  console.log(json);
});

/* Schedule DDNS */
scheduler(scheduleDDNS, async () => {
  const response = await fetch(
    `http://localhost:3000/ddns?token=${process.env.TOKEN}`,
    { method: "GET" }
  );
  const json = await response.json();
  console.log(json);
});

/* Poweroff display */
scheduler(schedulePoweroffDisplay, async () => {
  const response = await fetch(
    `http://localhost:3000/poweroffdisplay?token=${process.env.TOKEN}`,
    { method: "POST" }
  );
  const json = await response.json();
  console.log(json);
});

/*Send notification hourly*/
scheduler(scheduleNotifyTempCpu, async () => {
  const response = await fetch(
    `http://localhost:3000/notifications/cputemp?token=${process.env.TOKEN}`,
    { method: "GET" }
  );
  const json = await response.json();
  console.log(json);
});
