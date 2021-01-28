const fastify = require("fastify")();

const PORT = 9090;

fastify.register(require("fastify-cors"), {});
fastify.register(require("./router"));

fastify.listen(PORT, () => console.log(`Server is running on port ${PORT}...`));
