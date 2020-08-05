console.log(new Date("2020-08-04T04:00:21.087Z").getDate());
console.log(new Date().getDate());

if (new Date().getDate() !== new Date("2020-08-04T04:00:21.087Z").getDate()) {
  console.log("Diferente");
} else {
  console.log("igual");
}
