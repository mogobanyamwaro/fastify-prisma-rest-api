import Fastify, { FastifyRequest, FastifyReply } from "fastify";
import userRoutes from "./modules/user/user.route";
import { userSchemas } from "./modules/user/user.schema";
import fjwt from "fastify-jwt";

export const server = Fastify();
server.register(userRoutes, { prefix: "api/users" });
server.register(fjwt, {
  secret: "supersecret",
});
server.decorate(
  "authenticate",
  async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.send(error);
    }
  }
);
server.get("/hello", async (request, reply) => {
  return { hello: "world" };
});
async function main() {
  for (const schema of userSchemas) {
    server.addSchema(schema);
  }
  try {
    await server.listen(3000, "0.0.0.0");
    console.log("Server listening on port 3000");
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
}
main();
