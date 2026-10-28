import { cookies } from "next/headers";
import {
  isReaderId,
  newReaderId,
  READER_COOKIE,
  READER_COOKIE_MAX_AGE,
} from "@/lib/visitor";

/** RSC read: never mints a cookie, so a page render stays side-effect free. */
export async function readReaderId(): Promise<string | null> {
  const value = (await cookies()).get(READER_COOKIE)?.value;
  return isReaderId(value) ? value : null;
}

/** Route-handler read: mints and sets the cookie when it is missing or forged. */
export async function ensureReaderId(): Promise<string> {
  const jar = await cookies();
  const current = jar.get(READER_COOKIE)?.value;
  if (isReaderId(current)) return current;

  const id = newReaderId();
  jar.set(READER_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: READER_COOKIE_MAX_AGE,
  });
  return id;
}
