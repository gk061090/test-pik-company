const axios = require("axios");

module.exports = function (fastify, opts, done) {
  fastify.post("/login", async (req, reply) => {
    // В полном приложение можно сделать через fastify-reply-from
    try {
      const response = await axios.post(
        "https://app.clickup.com/v1/login?include_teams=true",
        {
          email: req.body.email,
          password: req.body.password,
        }
      );
      // Сокращаем вывод для браузера для экономии трафика
      // В полном приложении можно использовать lodash или ramda
      const { token, refresh_token, expiration, user } = response.data;
      const { username, email, id, timezone } = user;
      reply.send({
        token,
        refresh_token,
        expiration,
        user: { username, email, id, timezone },
      });
    } catch {
      reply.code(401).send({ message: "Error /login" });
    }
  });

  fastify.post("/refresh_token", async (req, reply) => {
    // В полном приложение можно сделать через fastify-reply-from
    try {
      const response = await axios.post(
        "https://app.clickup.com/v1/refresh_token",
        {},
        {
          headers: {
            Authorization: `Bearer ${req.headers.authorization}`,
          },
        }
      );
      const { token, expiration } = response.data;
      reply.send({ token, expiration });
    } catch {
      reply.code(401).send({ message: "Error /refresh_token" });
    }
  });

  fastify.get("/user", async (req, reply) => {
    // В полном приложение можно сделать через fastify-reply-from
    try {
      const response = await axios.get("https://app.clickup.com/v1/user", {
        headers: {
          Authorization: `token ${req.headers.authorization}`,
        },
      });
      const { username, email, id, timezone } = response.data.user;
      reply.send({ username, email, id, timezone });
    } catch {
      reply.code(401).send({ message: "Error /user" });
    }
  });

  done();
};
