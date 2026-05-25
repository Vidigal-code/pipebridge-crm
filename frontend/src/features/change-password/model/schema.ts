import { z } from "zod";

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const changePasswordSchema = z.object({
  old_password: z.string().min(1, "Senha atual é obrigatória"),
  new_password: z.string().regex(PASSWORD_REGEX, "8+ chars, maiúscula, minúscula, número e especial (@$!%*?&)"),
  confirm_password: z.string().min(1, "Confirmação é obrigatória"),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Senhas não conferem",
  path: ["confirm_password"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
