/**
 * AyuRAG-XAI Assessment Rule & Dependency Engine
 * Evaluates conditional question visibility, dynamic progress, and validates question schemas.
 */

/**
 * Supported condition operators
 */
export const OPERATORS = {
  EQUALS: 'equals',
  NOT_EQUALS: 'notEquals',
  INCLUDES: 'includes',
  NOT_INCLUDES: 'notIncludes',
  GREATER_THAN: 'greaterThan',
  LESS_THAN: 'lessThan',
  GREATER_THAN_OR_EQUAL: 'greaterThanOrEqual',
  LESS_THAN_OR_EQUAL: 'lessThanOrEqual',
  IN_RANGE: 'inRange'
};

/**
 * Evaluates a single rule condition against the given answers state.
 * 
 * @param {Object} condition - { questionId, operator, value, minValue, maxValue }
 * @param {Object} answers - current answers object { [questionId]: answerValue }
 * @returns {boolean} - true if condition is met
 */
export function evaluateCondition(condition, answers) {
  if (!condition || !condition.questionId) return true;

  const currentVal = answers[condition.questionId];

  // If answer hasn't been provided yet, condition is not met
  if (currentVal === undefined || currentVal === null || currentVal === '') {
    return false;
  }

  const { operator, value, minValue, maxValue } = condition;

  switch (operator) {
    case OPERATORS.EQUALS:
      return currentVal === value;

    case OPERATORS.NOT_EQUALS:
      return currentVal !== value;

    case OPERATORS.INCLUDES:
      if (Array.isArray(currentVal)) {
        return currentVal.includes(value);
      }
      if (typeof currentVal === 'string') {
        return currentVal.toLowerCase().includes(String(value).toLowerCase());
      }
      return false;

    case OPERATORS.NOT_INCLUDES:
      if (Array.isArray(currentVal)) {
        return !currentVal.includes(value);
      }
      if (typeof currentVal === 'string') {
        return !currentVal.toLowerCase().includes(String(value).toLowerCase());
      }
      return true;

    case OPERATORS.GREATER_THAN:
      return Number(currentVal) > Number(value);

    case OPERATORS.LESS_THAN:
      return Number(currentVal) < Number(value);

    case OPERATORS.GREATER_THAN_OR_EQUAL:
      return Number(currentVal) >= Number(value);

    case OPERATORS.LESS_THAN_OR_EQUAL:
      return Number(currentVal) <= Number(value);

    case OPERATORS.IN_RANGE:
      return Number(currentVal) >= Number(minValue) && Number(currentVal) <= Number(maxValue);

    default:
      console.warn(`[AssessmentRules] Unknown operator: "${operator}" for question "${condition.questionId}".`);
      return true;
  }
}

/**
 * Checks whether a question is currently visible based on its conditions and dependencies.
 * 
 * @param {Object} question - Question schema definition
 * @param {Object} answers - Current answers state
 * @returns {boolean} - true if question should be rendered
 */
export function isQuestionVisible(question, answers = {}) {
  // If no conditions defined, it is always visible
  const conditions = question.conditions || question.dependencies;
  if (!conditions || conditions.length === 0) {
    return true;
  }

  const logic = (question.conditionLogic || 'AND').toUpperCase();

  if (logic === 'OR') {
    return conditions.some(cond => evaluateCondition(cond, answers));
  }

  // Default is AND
  return conditions.every(cond => evaluateCondition(cond, answers));
}

/**
 * Filters a list of questions to only those currently visible.
 * 
 * @param {Array} questions - Array of question schema objects
 * @param {Object} answers - Current answers state
 * @returns {Array} - Array of visible questions
 */
export function getVisibleQuestions(questions, answers = {}) {
  if (!Array.isArray(questions)) return [];
  return questions.filter(q => isQuestionVisible(q, answers));
}

/**
 * Calculates dynamic assessment progress based on visible and required questions.
 * 
 * @param {Array} questions - All questions in the assessment
 * @param {Object} answers - Current answers
 * @returns {Object} - { totalRelevant, answeredCount, percent, isComplete }
 */
export function calculateAssessmentProgress(questions, answers = {}) {
  const visible = getVisibleQuestions(questions, answers);
  const totalRelevant = visible.length;

  if (totalRelevant === 0) {
    return { totalRelevant: 0, answeredCount: 0, percent: 100, isComplete: true };
  }

  const answeredCount = visible.filter(q => {
    const val = answers[q.id];
    if (val === undefined || val === null || val === '') return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }).length;

  const percent = Math.round((answeredCount / totalRelevant) * 100);
  const isComplete = answeredCount >= totalRelevant;

  return {
    totalRelevant,
    answeredCount,
    percent,
    isComplete
  };
}

/**
 * Groups questions by their section property and computes progress per section.
 * 
 * @param {Array} sections - Array of section descriptors [{ id, title, ... }]
 * @param {Array} questions - All questions
 * @param {Object} answers - Current answers
 * @returns {Array} - Sections augmented with visibility and progress
 */
export function calculateSectionProgress(sections, questions, answers = {}) {
  return sections.map(section => {
    const sectionQuestions = questions.filter(q => q.section === section.id);
    const visibleQuestions = getVisibleQuestions(sectionQuestions, answers);
    const progress = calculateAssessmentProgress(sectionQuestions, answers);

    return {
      ...section,
      totalQuestions: visibleQuestions.length,
      answeredQuestions: progress.answeredCount,
      percent: progress.percent,
      isComplete: progress.isComplete && visibleQuestions.length > 0
    };
  });
}

/**
 * Development-time validation for question schema integrity.
 * Checks for duplicate IDs, missing required fields, invalid types, and broken dependencies.
 * 
 * @param {Array} questions - Array of questions to validate
 * @param {string} domainName - Name of assessment domain (e.g. 'Lifestyle', 'Diet')
 * @returns {Object} - { isValid, errors, warnings }
 */
export function validateQuestionSchema(questions, domainName = 'Assessment') {
  const errors = [];
  const warnings = [];
  const seenIds = new Set();
  const validTypes = [
    'single-select',
    'multi-select',
    'yes-no',
    'slider',
    'scale',
    'frequency',
    'time',
    'number',
    'text',
    'search-select',
    'chips',
    'segmented-control'
  ];

  if (!Array.isArray(questions)) {
    errors.push(`[${domainName}] Questions must be an array.`);
    return { isValid: false, errors, warnings };
  }

  questions.forEach((q, index) => {
    // 1. ID check
    if (!q.id) {
      errors.push(`[${domainName}] Question at index ${index} is missing an 'id'.`);
    } else if (seenIds.has(q.id)) {
      errors.push(`[${domainName}] Duplicate question ID: "${q.id}".`);
    } else {
      seenIds.add(q.id);
    }

    // 2. Question text
    if (!q.question) {
      errors.push(`[${domainName}] Question "${q.id || index}" is missing 'question' prompt text.`);
    }

    // 3. Section
    if (!q.section) {
      warnings.push(`[${domainName}] Question "${q.id}" has no 'section' defined.`);
    }

    // 4. Type check
    if (!q.type) {
      errors.push(`[${domainName}] Question "${q.id}" is missing 'type'.`);
    } else if (!validTypes.includes(q.type)) {
      errors.push(`[${domainName}] Question "${q.id}" has invalid type: "${q.type}".`);
    }

    // 5. Options check for select-based types
    if (['single-select', 'multi-select', 'frequency', 'segmented-control'].includes(q.type)) {
      if (!Array.isArray(q.options) || q.options.length === 0) {
        errors.push(`[${domainName}] Question "${q.id}" (${q.type}) requires a non-empty 'options' array.`);
      } else {
        const optionIds = new Set();
        q.options.forEach((opt, optIndex) => {
          if (!opt.id && opt.value === undefined) {
            errors.push(`[${domainName}] Question "${q.id}" option at ${optIndex} is missing 'id' or 'value'.`);
          }
          const optKey = opt.id ?? opt.value;
          if (optionIds.has(optKey)) {
            warnings.push(`[${domainName}] Question "${q.id}" has duplicate option ID: "${optKey}".`);
          } else {
            optionIds.add(optKey);
          }
        });
      }
    }

    // 6. Slider/Scale check
    if (q.type === 'slider' || q.type === 'scale') {
      if (q.min !== undefined && q.max !== undefined && q.min >= q.max) {
        errors.push(`[${domainName}] Question "${q.id}" (${q.type}) has min (${q.min}) >= max (${q.max}).`);
      }
    }

    // 7. Dependencies check
    const conditions = q.conditions || q.dependencies;
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach(c => {
        if (!c.questionId) {
          errors.push(`[${domainName}] Question "${q.id}" has a condition with no 'questionId'.`);
        }
        if (c.operator && !Object.values(OPERATORS).includes(c.operator)) {
          errors.push(`[${domainName}] Question "${q.id}" uses invalid operator: "${c.operator}".`);
        }
      });
    }
  });

  // Cross-check: check if dependent questions reference known question IDs
  questions.forEach(q => {
    const conditions = q.conditions || q.dependencies;
    if (conditions && Array.isArray(conditions)) {
      conditions.forEach(c => {
        if (c.questionId && !seenIds.has(c.questionId)) {
          warnings.push(`[${domainName}] Question "${q.id}" depends on unknown questionId "${c.questionId}".`);
        }
      });
    }
  });

  if (import.meta.env?.DEV) {
    if (errors.length > 0) {
      console.error(`[AssessmentValidation] Found ${errors.length} errors in ${domainName}:`, errors);
    }
    if (warnings.length > 0) {
      console.warn(`[AssessmentValidation] Found ${warnings.length} warnings in ${domainName}:`, warnings);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
