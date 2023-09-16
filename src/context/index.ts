import { Session } from "@supabase/supabase-js";
import { atom } from "jotai";

export const navAtom = atom(false);

export const registerModalAtom = atom(false);

export const sessionAtom = atom<Session | null>(null);
