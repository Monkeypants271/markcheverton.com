import { storyDogs } from "../src/data/storyDogs";
import { classroomIntroduction } from "../src/data/storyDogsTeacher";

process.stdout.write(JSON.stringify(storyDogs.map(stage => ({ label: stage.label, title: stage.title, questions: stage.questions, help: stage.help, classroomIntroduction })), null, 2));
