import { post as first } from "./post-1.mjs";
import { post as second } from "./post-2.mjs";
import { post as third } from "./post-3.mjs";

/** Newest first, so the archive's default order looks intentional. */
export const posts = [first, second, third];
