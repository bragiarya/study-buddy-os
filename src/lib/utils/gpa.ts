export const GRADE_VALUES: Record<string, number> = {
  'A': 4.0,
  'A-': 3.7,
  'B+': 3.3,
  'B': 3.0,
  'B-': 2.7,
  'C+': 2.3,
  'C': 2.0,
  'D': 1.0,
  'E': 0.0,
};

export const calculateGPA = (subjects: { grade: string, credits: number }[]): number => {
  if (subjects.length === 0) return 0;
  
  let totalPoints = 0;
  let totalCredits = 0;

  subjects.forEach(subject => {
    const gradeWeight = GRADE_VALUES[subject.grade] || 0;
    totalPoints += gradeWeight * subject.credits;
    totalCredits += subject.credits;
  });

  return totalCredits === 0 ? 0 : Number((totalPoints / totalCredits).toFixed(2));
};
