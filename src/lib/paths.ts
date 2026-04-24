import profileData from "../../data/profile.json";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
const resumeFileName = (profileData.name as string).replace(/\s+/g, "_") + "_Resume.pdf";

export const resumeHref = `${basePath}/${resumeFileName}`;
export const avatarHref = `${basePath}/avatar.jpg`;
export const avatarWebpHref = `${basePath}/avatar.webp`;
