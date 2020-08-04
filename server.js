const server = require("./src/app");

const port = process.env.PORT || 3000;

/* Alterado */
server.listen(port, () => console.log(`Executando na porta ${port}`));
