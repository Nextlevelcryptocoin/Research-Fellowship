import { MasteriyoCourseMapping } from '../types';
import { FELLOWSHIPS } from './fellowships';

export const MASTERIYO_COURSE_MAPPINGS: MasteriyoCourseMapping[] = FELLOWSHIPS.map((f, i) => ({
  fellowshipId: f.id,
  fellowshipSlug: f.slug,
  fellowshipTitle: f.title,
  masteriyoCourseId: `mst-course-${101 + i}`,
  masteriyoCourseSlug: `unsp-fellowship-${f.slug}`
}));

export function getMasteriyoCourseForFellowship(fellowshipId: string): MasteriyoCourseMapping | undefined {
  return MASTERIYO_COURSE_MAPPINGS.find((m) => m.fellowshipId === fellowshipId);
}
