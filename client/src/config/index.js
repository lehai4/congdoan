import { z } from "zod";

const configSchema = z.object({
  VITE_API_ENDPOINT: z.string(),
});

// Sử dụng `import.meta.env` để lấy biến môi trường trong Vite
const configClient = configSchema.safeParse({
  VITE_API_ENDPOINT: import.meta.env.VITE_API_ENDPOINT || "",
});

if (!configClient.success) {
  console.error(configClient.error.issues);
  throw new Error("The values declared in env are invalid");
}

const envConfig = configClient.data;
export default envConfig;
