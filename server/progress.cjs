const topics = require('../public/curriculum.js');
const steps = new Map();
for (const topic of topics) for (const section of topic.sections) for (const step of section.steps) {
  steps.set(topic.id + '/' + step.id, step);
}
const empty = () => ({done:{}, code:{}, answers:{}});
function fail(status, message) { throw Object.assign(new Error(message), {status}); }
function validate(state) {
  const invalid = () => fail(422, 'Natijalar formati noto‘g‘ri.');
  const record = v => v && typeof v === 'object' && !Array.isArray(v);
  if (!record(state) || Object.keys(state).length !== 3) invalid();
  for (const field of ['done','answers','code']) {
    if (!record(state[field])) invalid();
    for (const [key,value] of Object.entries(state[field])) {
      const step = steps.get(key);
      if (!step) invalid();
      if (field === 'done' && value !== true) invalid();
      if (field === 'code' && (step.questions || typeof value !== 'string')) invalid();
      if (field === 'answers' && (!step.questions || !Array.isArray(value) || value.length > step.questions.length ||
        value.some((a,i) => a !== null && !(Number.isInteger(a) && a >= 0 && a < step.questions[i].options.length)))) invalid();
    }
  }
  let practice=0, lessons=0, quizzes=0, passed=0, marks=0, max=0;
  const individual = {};
  for (const [key,step] of steps) {
    if (!step.questions) { lessons++; if (state.done[key]) practice++; continue; }
    quizzes++;
    const answers = state.answers[key] || [];
    const correct = step.questions.filter((q,i) => q.answer === answers[i]).length;
    individual[key] = correct;
    marks += correct;
    max += step.questions.length;
    if (state.done[key] && correct === step.questions.length) passed++;
    else delete state.done[key];
  }
  return {practice,lessons,passed,quizzes,marks,max,individual,percentage:(practice+passed)/steps.size};
}
module.exports = {empty,validate,fail};

