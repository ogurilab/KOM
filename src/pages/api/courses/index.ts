import { createClient } from "@supabase/supabase-js";
import CryptoJS from "crypto-js";
import { z } from "zod";
import { validate } from "@/lib/validate";
import { Database, insertCourseSchema } from "@/schema/db";

export const config = {
  runtime: "edge",
};

const { SUPABASE_URL, SUPABASE_ANON_KEY } = process.env as Record<
  string,
  string
>;

const postHandler = async (request: Request): Promise<Response> => {
  try {
    const body = await request.json();
    validate(body, insertCourseSchema);

    const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY);

    const {
      class_password,
      day_of_week,
      name,
      term,
      time_slot,
      year,
      class_code,
      user_id,
    } = body;

    const hashed = CryptoJS.SHA256(class_password).toString(CryptoJS.enc.Hex);

    const insertData = {
      class_code,
      class_password: hashed,
      day_of_week,
      name,
      term,
      time_slot,
      year,
      user_id,
    };

    const { error } = await supabase.from("courses").insert([insertData]);

    if (error) throw error;

    return new Response(JSON.stringify(class_code), {
      status: 200,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error), {
        status: 400,
      });
    }

    return new Response(JSON.stringify(error), {
      status: 500,
    });
  }
};

const notAllowedHandler = () => {
  return new Response(
    JSON.stringify({
      message: "Method not allowed",
    }),
    {
      status: 500,
    }
  );
};

const handlers = async (req: Request) => {
  switch (req.method) {
    case "POST":
      return postHandler(req);
    default:
      return notAllowedHandler();
  }
};

export default handlers;
