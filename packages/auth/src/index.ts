
import { db } from "@workspace/db";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";


const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql"
    })
});

export {auth}