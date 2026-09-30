const DOSAGE_REGEX = /\d+\s?(ml|g|gm|kg)\s?(\/|per)\s?(l|litre|liter|acre|ha)/gi;
const SAFE_DOSAGE_NOTE = 'Follow the product label and local agriculture department recommendation.';

export function postProcessAdvisoryOutput(advisoryType, parsedOutput) {
  const output = JSON.parse(JSON.stringify(parsedOutput));

  // 1. Truncate title to 100 characters
  if (output.title && output.title.length > 100) {
    output.title = output.title.slice(0, 97) + '...';
  }

  // 2. Expert escalation enforcement for low-confidence disease diagnosis
  if (
    advisoryType === 'disease_diagnosis' &&
    output.confidence === 'low' &&
    (!output.escalate_to_expert || !output.escalate_to_expert.needed)
  ) {
    output.escalate_to_expert = {
      needed: true,
      reason: output.confidence_reason || 'Diagnosis confidence is low based on the provided symptoms or image clarity.',
      who: 'Local agriculture officer or nearest KVK',
    };
  }

  // 3. Post-process chemical recommendation entries for disease_diagnosis and pest_management
  if (advisoryType === 'disease_diagnosis' && output.result?.chemical_options_last_resort) {
    output.result.chemical_options_last_resort = output.result.chemical_options_last_resort.map((item) => {
      let activeClass = item.active_ingredient_or_class || '';
      let whenToConsider = item.when_to_consider || '';
      let safetyNote = item.safety_note || '';

      if (DOSAGE_REGEX.test(activeClass)) {
        activeClass = activeClass.replace(DOSAGE_REGEX, SAFE_DOSAGE_NOTE);
      }
      if (DOSAGE_REGEX.test(whenToConsider)) {
        whenToConsider = whenToConsider.replace(DOSAGE_REGEX, SAFE_DOSAGE_NOTE);
      }
      if (DOSAGE_REGEX.test(safetyNote)) {
        safetyNote = safetyNote.replace(DOSAGE_REGEX, SAFE_DOSAGE_NOTE);
      }

      return {
        ...item,
        active_ingredient_or_class: activeClass,
        when_to_consider: whenToConsider,
        safety_note: safetyNote,
      };
    });
  }

  if (advisoryType === 'pest_management' && output.result?.ipm_tiers?.chemical_last_resort) {
    output.result.ipm_tiers.chemical_last_resort = output.result.ipm_tiers.chemical_last_resort.map((item) => {
      let activeClass = item.active_ingredient_or_class || '';
      let whenToConsider = item.when_to_consider || '';
      let resistanceNote = item.resistance_management_note || '';

      if (DOSAGE_REGEX.test(activeClass)) {
        activeClass = activeClass.replace(DOSAGE_REGEX, SAFE_DOSAGE_NOTE);
      }
      if (DOSAGE_REGEX.test(whenToConsider)) {
        whenToConsider = whenToConsider.replace(DOSAGE_REGEX, SAFE_DOSAGE_NOTE);
      }
      if (DOSAGE_REGEX.test(resistanceNote)) {
        resistanceNote = resistanceNote.replace(DOSAGE_REGEX, SAFE_DOSAGE_NOTE);
      }

      return {
        ...item,
        active_ingredient_or_class: activeClass,
        when_to_consider: whenToConsider,
        resistance_management_note: resistanceNote,
      };
    });
  }

  return output;
}
