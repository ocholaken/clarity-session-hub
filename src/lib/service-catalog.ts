import type { LucideIcon } from "lucide-react";
import {
  BriefcaseBusiness,
  GraduationCap,
  HeartHandshake,
  UsersRound,
  UserRound,
} from "lucide-react";

export type ServiceCategory = "clinical" | "schools";

export interface CatalogService {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  duration_label: string;
  price: number;
  price_label: string;
  category: ServiceCategory;
  badge?: string;
  audience?: string;
  icon: LucideIcon;
}

export const serviceCatalog: CatalogService[] = [
  {
    id: "1",
    name: "Individual Therapy",
    description: "One-on-one sessions focused on personal growth and addressing specific challenges.",
    duration_minutes: 60,
    duration_label: "60 minutes",
    price: 3500,
    price_label: "KSh 3,500 / session",
    category: "clinical",
    icon: UserRound,
  },
  {
    id: "2",
    name: "Couples Counseling",
    description: "Build stronger relationships through guided sessions for partners.",
    duration_minutes: 90,
    duration_label: "90 minutes",
    price: 3500,
    price_label: "KSh 3,500 / session",
    category: "clinical",
    icon: HeartHandshake,
  },
  {
    id: "3",
    name: "Family Therapy",
    description: "Resolve conflicts and improve communication within family units.",
    duration_minutes: 60,
    duration_label: "60 minutes",
    price: 3000,
    price_label: "KSh 3,000 / session",
    category: "clinical",
    icon: UsersRound,
  },
  {
    id: "4",
    name: "Group Therapy",
    description: "Share experiences and learn from others in a supportive group environment.",
    duration_minutes: 120,
    duration_label: "120 minutes",
    price: 2500,
    price_label: "KSh 2,500 / session",
    category: "clinical",
    icon: UsersRound,
  },
  {
    id: "5",
    name: "Student Counseling",
    description: "Support for academic pressure, exam stress, and life decisions for students.",
    duration_minutes: 60,
    duration_label: "60 minutes",
    price: 3000,
    price_label: "KSh 3,000 / session",
    category: "clinical",
    icon: GraduationCap,
  },
  {
    id: "6",
    name: "Career Guidance",
    description: "Navigate career transitions, set goals, and discover your professional path.",
    duration_minutes: 60,
    duration_label: "60 minutes",
    price: 3500,
    price_label: "KSh 3,500 / session",
    category: "clinical",
    icon: BriefcaseBusiness,
  },
  {
    id: "school-personal-development",
    name: "Personal Development Mastery",
    description: "A transformative program cultivating self-awareness, emotional intelligence, and a growth mindset, aligned with CBC.",
    duration_minutes: 120,
    duration_label: "120 minutes",
    price: 15000,
    price_label: "KSh 15,000 / session (up to 100 students)",
    category: "schools",
    badge: "Most Requested",
    audience: "Primary - High School",
    icon: GraduationCap,
  },
  {
    id: "school-keynote",
    name: "Motivational Keynote Speaking",
    description: "An energizing keynote designed to move students from apathy toward purpose, delivered by a clinical psychologist.",
    duration_minutes: 90,
    duration_label: "90 minutes + Q&A",
    price: 25000,
    price_label: "KSh 25,000 / keynote",
    category: "schools",
    badge: "Premium",
    audience: "School Assembly / Prize Giving",
    icon: UserRound,
  },
  {
    id: "school-exam-resilience",
    name: "Peak Performance: Exam Resilience Clinic",
    description: "A CBT-informed clinic helping KCSE candidates manage exam anxiety and build performance resilience.",
    duration_minutes: 180,
    duration_label: "180 minutes",
    price: 12000,
    price_label: "KSh 12,000 / class",
    category: "schools",
    badge: "Results-Driven",
    audience: "Candidate Classes",
    icon: GraduationCap,
  },
  {
    id: "school-leadership",
    name: "Leadership & Prefects Executive Training",
    description: "A practical leadership lab that equips student councils to lead with service, accountability, and confidence.",
    duration_minutes: 480,
    duration_label: "Full day",
    price: 18000,
    price_label: "KSh 18,000 / cohort",
    category: "schools",
    badge: "Leadership",
    audience: "Prefects & Council",
    icon: UsersRound,
  },
  {
    id: "school-teacher-wellness",
    name: "Teachers Wellness & Burnout Prevention",
    description: "A supportive, confidential staff session for teacher wellbeing, burnout prevention, and the pressures of CBC.",
    duration_minutes: 120,
    duration_label: "120 minutes",
    price: 20000,
    price_label: "KSh 20,000 / staff session",
    category: "schools",
    badge: "For Educators",
    audience: "Teaching Staff",
    icon: HeartHandshake,
  },
  {
    id: "school-anti-bullying",
    name: "Anti-Bullying & Peer Mediation System",
    description: "A whole-school peer support and mediation system informed by established bullying-prevention practice.",
    duration_minutes: 960,
    duration_label: "2-day installation",
    price: 30000,
    price_label: "KSh 30,000 / setup",
    category: "schools",
    badge: "System-Level",
    audience: "Whole School",
    icon: BriefcaseBusiness,
  },
];
