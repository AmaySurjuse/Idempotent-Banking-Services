import { z } from "zod";

export const transferSchema = z.object({
    senderaccountid: z.string().length(24, "Invalid Sender ID. Must be a 24-character ."),
    receiveraccountid: z.string().length(24, "Invalid Receiver ID. Must be a 24-character ."),
    amount: z.number().positive("Amount must be a positive number greater than zero."),
    description: z.string().max(100, "Cannot exceed 100 characters.").optional()
});