import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secretKey = process.env.AUTH_SECRET || "default_secret_key";
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(key);
}

export async function decrypt(input: string): Promise<any> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ["HS256"],
  });
  return payload;
}

export async function login(username: string) {
  const expires = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours
  const session = await encrypt({ username, expires });

  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true, path: "/" });
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0), path: "/" });
}

export async function getSession(sessionToken?: string) {
  if (sessionToken) {
    try {
      return await decrypt(sessionToken);
    } catch (err) {
      return null;
    }
  }

  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
  } catch (err) {
    return null;
  }
}
