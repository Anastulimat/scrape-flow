"use server";

import {createCredentialSchema, createCredentialSchemaType} from "@/schema/credential";
import {auth} from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {revalidatePath} from "next/cache";
import {symmetricEncrypt} from "@/lib/encyption";

// ----------------------------------------------------------------------

export async function CreateCredential(form: createCredentialSchemaType) {
    const {success, data} = createCredentialSchema.safeParse(form);
    if (!success) {
        throw new Error("Invalid form data");
    }

    const {userId} = auth();
    if (!userId) {
        throw new Error("Not authenticated");
    }

    // Encrypt the value
    const encryptedValue = symmetricEncrypt(data.value);
    const result = await prisma.credential.create({
        data: {
            userId,
            name: data.name,
            value: encryptedValue,
        }
    });

    if (!result) {
        throw new Error("Failed to create credential");
    }

    revalidatePath("/credentials");

}
