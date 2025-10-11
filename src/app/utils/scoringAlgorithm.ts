// Scoring Algorithm for CourseFinder Personality Test
// Based on Holland Code (RIASEC) and MBTI/Jungian Typology

export interface PersonalityTestAnswers {
  [questionIndex: number]: number; // 1-7 Likert scale
}

export interface RIASECScores {
  R: number; // Realistic
  I: number; // Investigative  
  A: number; // Artistic
  S: number; // Social
  E: number; // Enterprising
  C: number; // Conventional
}

export interface MBTIScores {
  E: number; // Extraversion
  I: number; // Introversion
  S: number; // Sensing
  N: number; // Intuition
  T: number; // Thinking
  F: number; // Feeling
  J: number; // Judging
  P: number; // Perceiving
}

export interface PersonalityResult {
  riasec: {
    scores: RIASECScores;
    topTwo: string[];
    ranking: Array<{code: string, score: number}>;
  };
  mbti: {
    scores: MBTIScores;
    type: string;
    dimensions: {
      EI: string;
      SN: string;
      TF: string;
      JP: string;
    };
  };
}

/**
 * Calculate RIASEC scores from questions 1-60 (Sets 1-6)
 * Each set has 10 questions, scored 1-7
 */
export function calculateRIASECScores(answers: PersonalityTestAnswers): RIASECScores {
  const scores: RIASECScores = {
    R: 0, // Set 1: Questions 1-10 (indices 0-9)
    I: 0, // Set 2: Questions 11-20 (indices 10-19)
    A: 0, // Set 3: Questions 21-30 (indices 20-29)
    S: 0, // Set 4: Questions 31-40 (indices 30-39)
    E: 0, // Set 5: Questions 41-50 (indices 40-49)
    C: 0  // Set 6: Questions 51-60 (indices 50-59)
  };

  // Calculate scores for each RIASEC dimension
  // Set 1 (R - Realistic): Questions 0-9
  for (let i = 0; i < 10; i++) {
    scores.R += answers[i] || 0;
  }

  // Set 2 (I - Investigative): Questions 10-19
  for (let i = 10; i < 20; i++) {
    scores.I += answers[i] || 0;
  }

  // Set 3 (A - Artistic): Questions 20-29
  for (let i = 20; i < 30; i++) {
    scores.A += answers[i] || 0;
  }

  // Set 4 (S - Social): Questions 30-39
  for (let i = 30; i < 40; i++) {
    scores.S += answers[i] || 0;
  }

  // Set 5 (E - Enterprising): Questions 40-49
  for (let i = 40; i < 50; i++) {
    scores.E += answers[i] || 0;
  }

  // Set 6 (C - Conventional): Questions 50-59
  for (let i = 50; i < 60; i++) {
    scores.C += answers[i] || 0;
  }

  return scores;
}

/**
 * Calculate MBTI scores from questions 61-100 (Sets 7-10)
 * Each set has 10 questions, some questions are reverse-scored
 */
export function calculateMBTIScores(answers: PersonalityTestAnswers): MBTIScores {
  const scores: MBTIScores = {
    E: 0, I: 0, // Extraversion vs Introversion
    S: 0, N: 0, // Sensing vs Intuition
    T: 0, F: 0, // Thinking vs Feeling
    J: 0, P: 0  // Judging vs Perceiving
  };

  // Set 7 (E vs I): Questions 60-69
  // Questions 0-4 are Extraversion, Questions 5-9 are Introversion
  for (let i = 60; i < 65; i++) {
    scores.E += answers[i] || 0;
  }
  for (let i = 65; i < 70; i++) {
    scores.I += answers[i] || 0;
  }

  // Set 8 (S vs N): Questions 70-79
  // Questions 0-4 are Sensing, Questions 5-9 are Intuition
  for (let i = 70; i < 75; i++) {
    scores.S += answers[i] || 0;
  }
  for (let i = 75; i < 80; i++) {
    scores.N += answers[i] || 0;
  }

  // Set 9 (T vs F): Questions 80-89
  // Questions 0-4 are Thinking, Questions 5-9 are Feeling
  for (let i = 80; i < 85; i++) {
    scores.T += answers[i] || 0;
  }
  for (let i = 85; i < 90; i++) {
    scores.F += answers[i] || 0;
  }

  // Set 10 (J vs P): Questions 90-99
  // Questions 0-4 are Judging, Questions 5-9 are Perceiving
  for (let i = 90; i < 95; i++) {
    scores.J += answers[i] || 0;
  }
  for (let i = 95; i < 100; i++) {
    scores.P += answers[i] || 0;
  }

  return scores;
}

/**
 * Get top 2 RIASEC codes ranked by score
 */
export function getRIASECTopTwo(scores: RIASECScores): string[] {
  const ranking = Object.entries(scores)
    .map(([code, score]) => ({ code, score }))
    .sort((a, b) => b.score - a.score);
  
  return ranking.slice(0, 2).map(item => item.code);
}

/**
 * Get RIASEC ranking from highest to lowest
 */
export function getRIASECRanking(scores: RIASECScores): Array<{code: string, score: number}> {
  return Object.entries(scores)
    .map(([code, score]) => ({ code, score }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Determine MBTI type from scores
 */
export function getMBTIType(scores: MBTIScores): string {
  const dimensions = {
    EI: scores.E > scores.I ? 'E' : 'I',
    SN: scores.S > scores.N ? 'S' : 'N',
    TF: scores.T > scores.F ? 'T' : 'F',
    JP: scores.J > scores.P ? 'J' : 'P'
  };

  return dimensions.EI + dimensions.SN + dimensions.TF + dimensions.JP;
}

/**
 * Main function to calculate complete personality results
 */
export function calculatePersonalityResults(answers: PersonalityTestAnswers): PersonalityResult {
  // Calculate RIASEC scores (questions 0-59)
  const riasecScores = calculateRIASECScores(answers);
  const riasecTopTwo = getRIASECTopTwo(riasecScores);
  const riasecRanking = getRIASECRanking(riasecScores);

  // Calculate MBTI scores (questions 60-99)
  const mbtiScores = calculateMBTIScores(answers);
  const mbtiType = getMBTIType(mbtiScores);

  return {
    riasec: {
      scores: riasecScores,
      topTwo: riasecTopTwo,
      ranking: riasecRanking
    },
    mbti: {
      scores: mbtiScores,
      type: mbtiType,
      dimensions: {
        EI: mbtiScores.E > mbtiScores.I ? 'E' : 'I',
        SN: mbtiScores.S > mbtiScores.N ? 'S' : 'N',
        TF: mbtiScores.T > mbtiScores.F ? 'T' : 'F',
        JP: mbtiScores.J > mbtiScores.P ? 'J' : 'P'
      }
    }
  };
}

/**
 * Example usage and testing function
 */
export function testScoringAlgorithm(): void {
  // Example answers for testing
  const testAnswers: PersonalityTestAnswers = {};
  
  // Fill with sample data (all 3s for neutral)
  for (let i = 0; i < 100; i++) {
    testAnswers[i] = 3;
  }

  // Test with some variation
  // Make R (Realistic) higher
  for (let i = 0; i < 10; i++) {
    testAnswers[i] = 5;
  }
  
  // Make I (Investigative) second highest
  for (let i = 10; i < 20; i++) {
    testAnswers[i] = 4;
  }

  // Make E (Extraversion) higher
  for (let i = 60; i < 65; i++) {
    testAnswers[i] = 5;
  }

  // Make N (Intuition) higher
  for (let i = 75; i < 80; i++) {
    testAnswers[i] = 4;
  }

  const results = calculatePersonalityResults(testAnswers);
  console.log('Test Results:', results);
}
