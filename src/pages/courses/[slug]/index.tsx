import React, { Suspense } from "react";
import { Course } from "@/features/courses/components/slug";

function Page() {
  return (
    <Suspense>
      <Course />
    </Suspense>
  );
}

export default Page;
