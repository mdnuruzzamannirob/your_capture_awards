import { SkillLevel } from "@/types/team"

export const LANGUAGES = [
  "Bengali", "English", "Arabic", "Chinese", "French", "German",
  "Hindi", "Indonesian", "Italian", "Japanese", "Korean", "Malay",
  "Portuguese", "Russian", "Spanish", "Thai", "Turkish", "Urdu", "Vietnamese",
] as const

export const COUNTRIES = [
  "Bangladesh", "Brazil", "Canada", "China", "Egypt", "France", "Germany",
  "India", "Indonesia", "Italy", "Japan", "Malaysia", "Mexico", "Nigeria",
  "Pakistan", "Philippines", "Russia", "Saudi Arabia", "South Korea",
  "Spain", "Thailand", "Turkey", "United Kingdom", "United States", "Vietnam",
] as const

export const SKILL_LEVELS: SkillLevel[] = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"]
