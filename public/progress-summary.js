'use strict';
// Use the same curriculum keys and checked quiz answers on both sides of the API.
function summarizeProgress(steps,state,clean=false) {
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
    else if (clean) delete state.done[key];
  }
  return {practice,lessons,passed,quizzes,marks,max,individual,percentage:(practice+passed)/steps.size};
}
if(typeof module!=='undefined') module.exports=summarizeProgress;
