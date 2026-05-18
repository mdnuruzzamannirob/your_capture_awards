import z from "zod";

export const editTeamSchema = z.object({
  name: z.string().min(3, 'At least 3 characters').max(50, 'Too long'),
  description: z.string().max(300, 'Max 300 characters').optional(),
  language: z.string().min(1, 'Select a language'),
  country: z.string().min(1, 'Select a country'),
});

export const teamSettingsSchema = z.object({
  member_slots: z.coerce.number().min(1).max(50),
  skill_level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT']),
  min_requirement: z.coerce.number().min(0),
});

export type EditTeamValues = z.infer<typeof editTeamSchema>;
export type TeamSettingsValues = z.infer<typeof teamSettingsSchema>;
