"use client";

import type { ComponentType } from "react";
import RawCourseLab from "../../node_modules/teaching-cpd/app/components/CourseLab";
import type { Course } from "teaching-cpd/lib/data";

type Props = {
  course: Course;
  allCourses: Course[];
  savedMeta: Record<string, string>;
  completedCount: number;
  totalModules: number;
  onSaveMeta: (key: string, value: string) => Promise<void>;
  onOpenCourse: (course: Course) => void;
};

const CourseLab = RawCourseLab as unknown as ComponentType<Props>;

export default CourseLab;
