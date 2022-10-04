import { hashPassword } from "../../utils/hash";
import prisma from "../../utils/prisma";
import { CreateUserInput } from "./user.schema";
export async function createUser(input: CreateUserInput) {
  // ...
  const userExists = await prisma.user.findFirst({
    where: {
      email: input.email,
    },
  });
  if (userExists) {
    return {
      code: 400,
      message: "User already exists",
    };
  }
  const { password, ...rest } = input;
  const { hash, salt } = hashPassword(password);
  const user = await prisma.user.create({
    data: {
      ...rest,
      password: hash,
      salt,
    },
  });
  return user;
}

export async function findUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
  });
}

export async function findUsers() {
  return prisma.user.findMany({
    select: {
      email: true,
      name: true,
      id: true,
    },
  });
}
