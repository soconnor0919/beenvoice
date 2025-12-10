import { createHash } from "crypto";

export function getGravatarUrl(email: string, size = 200) {
    const trimmedEmail = email.trim().toLowerCase();
    const hash = createHash("sha256").update(trimmedEmail).digest("hex");
    return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;
}
