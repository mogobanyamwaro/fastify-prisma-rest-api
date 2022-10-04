import { FastifyReply, FastifyRequest } from "fastify";
import { server } from "../../app";
import { verifyPassword } from "../../utils/hash";
import { CreateUserInput, LoginInput } from "./user.schema";
import { createUser, findUserByEmail, findUsers } from "./user.service";

export async function registerUserHandler(
  request: FastifyRequest<{ Body: CreateUserInput }>,
  reply: FastifyReply
) {
  const body = request.body;
  try {
    const user = await createUser(body);
    return reply.status(201).send(user);
  } catch (error) {
    console.log(error);
    return reply.status(500).send(error);
  }
}

export async function loginHandler(
  request: FastifyRequest<{ Body: LoginInput }>,
  resply: FastifyReply
) {
  const body = request.body;
  const user = await findUserByEmail(body.email);
  if (!user) {
    return resply.status(401).send({ message: "User not found" });
  }
  const correctPassword = verifyPassword({
    password: body.password,
    hash: user.password,
    salt: user.salt,
  });
  if (correctPassword) {
    const { password, ...rest } = user;
    return { accessToken: server.jwt.sign(rest) };
  }
  return resply.status(401).send({ message: "Incorrect password" });
}
export async function getUsersHandler() {
  const users = await findUsers();
  return users;
}
