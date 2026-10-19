import { scienceTopics } from "./sciences";
import { humanitiesTopics } from "./humanities";
import { artTopics } from "./arts";
import { technologyTopics } from "./technology";
export { specialties, officialResources } from "./types";
export type { OralTopic, OralVariant, SpecialtyId } from "./types";

export const oralTopics = [...scienceTopics, ...humanitiesTopics, ...artTopics, ...technologyTopics];

export { buildIntroduction, buildConclusion } from "../../utils/oral-generator";
