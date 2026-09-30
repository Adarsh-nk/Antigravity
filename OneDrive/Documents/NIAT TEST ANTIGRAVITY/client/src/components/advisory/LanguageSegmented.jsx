import React from 'react';
import { SegmentedControl } from '../ui/SegmentedControl.jsx';
import { FormField } from '../ui/FormField.jsx';

export function LanguageSegmented({ value, onChange }) {
  const options = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिन्दी (Hindi)' },
    { value: 'mr', label: 'मराठी (Marathi)' },
  ];

  return (
    <FormField label="AI Advice Output Language" hint="The AI structured output will be written in this language.">
      <SegmentedControl options={options} value={value} onChange={onChange} />
    </FormField>
  );
}
