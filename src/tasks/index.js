const scheduler = require("../services/scheduler.js");
const TelemetryController = require("../app/controllers/TelemetryController");
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

//const schedule = "*/15 * * * * *"; //Executa de 15 em 15 segundos
const schedule = "0 0 */1 * * *"; //Executa de 1 em 1 hora

scheduler(schedule, () => TelemetryController.store2());
