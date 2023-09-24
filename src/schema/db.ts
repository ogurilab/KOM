import { z } from "zod";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      course_members: {
        Row: {
          course_id: string;
          created_at: string;
          id: number;
          profile_id: string;
        };
        Insert: {
          course_id: string;
          created_at?: string;
          id?: number;
          profile_id: string;
        };
        Update: {
          course_id?: string;
          created_at?: string;
          id?: number;
          profile_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "course_members_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "course_members_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      courses: {
        Row: {
          class_code: string;
          class_password: string | null;
          created_at: string;
          day_of_week: number;
          id: string;
          name: string;
          term: string;
          time_slot: number;
          user_id: string;
          year: number;
        };
        Insert: {
          class_code: string;
          class_password?: string | null;
          created_at?: string;
          day_of_week: number;
          id?: string;
          name: string;
          term: string;
          time_slot: number;
          user_id: string;
          year: number;
        };
        Update: {
          class_code?: string;
          class_password?: string | null;
          created_at?: string;
          day_of_week?: number;
          id?: string;
          name?: string;
          term?: string;
          time_slot?: number;
          user_id?: string;
          year?: number;
        };
        Relationships: [
          {
            foreignKeyName: "courses_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      messages: {
        Row: {
          content: string;
          course_id: string;
          created_at: string;
          id: number;
          profile_id: string;
          type: Database["public"]["Enums"]["message_type"] | null;
          updated_at: string;
        };
        Insert: {
          content: string;
          course_id: string;
          created_at?: string;
          id?: number;
          profile_id: string;
          type?: Database["public"]["Enums"]["message_type"] | null;
          updated_at?: string;
        };
        Update: {
          content?: string;
          course_id?: string;
          created_at?: string;
          id?: number;
          profile_id?: string;
          type?: Database["public"]["Enums"]["message_type"] | null;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "messages_course_id_fkey";
            columns: ["course_id"];
            referencedRelation: "courses";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "messages_profile_id_fkey";
            columns: ["profile_id"];
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          created_at: string;
          id: string;
          role: Database["public"]["Enums"]["user_role"];
        };
        Insert: {
          created_at?: string;
          id: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Update: {
          created_at?: string;
          id?: string;
          role?: Database["public"]["Enums"]["user_role"];
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      message_type: "Question" | "Contact" | "Request" | "ChitChat" | "Others";
      user_role: "Teacher" | "Student";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export type Course = Database["public"]["Tables"]["courses"]["Row"];

export type Message = Database["public"]["Tables"]["messages"]["Row"] & {
  profile: {
    role: Profile["role"];
  } | null;
};

export type MessageType = Database["public"]["Enums"]["message_type"];

export type RoleType = Database["public"]["Enums"]["user_role"];

export const Role = {
  Teacher: "Teacher" as RoleType,
  Student: "Student" as RoleType,
};

export const insertCourseSchema = z.object({
  class_code: z.string(),
  class_password: z.string(),
  day_of_week: z.number(),
  name: z.string(),
  term: z.string(),
  time_slot: z.number(),
  year: z.number(),
  user_id: z.string(),
});

export type InsertCourseSchema = z.infer<typeof insertCourseSchema>;
