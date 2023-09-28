import { Session, User } from "@supabase/supabase-js";
import { atom } from "jotai";
import { RefObject } from "react";
import { Categories, MessageType, Profile } from "@/schema/db";

export const navAtom = atom(false);

export const registerModalAtom = atom(false);

export const sessionAtom = atom<Session | null>(null);

export const questionAtom = atom<null | number>(null);
export const messageInputRefAtom = atom<null | RefObject<HTMLTextAreaElement>>(
  null
);
export const selectedCategoryAtom = atom<MessageType>(Categories.Others);

export const userAtom = atom<{
  data: User;
  profile: Omit<Profile, "created_at"> | null;
} | null>(null);

export const qAndAAtom = atom(false);
