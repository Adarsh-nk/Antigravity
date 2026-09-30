import React, { useState } from 'react';
import { CROP_CATEGORIES } from '../../config/domain.js';
import { Select } from '../ui/Select.jsx';
import { Input } from '../ui/Input.jsx';
import { FormField } from '../ui/FormField.jsx';

export function CropPicker({ value, onChange, error, required = true }) {
  const allStandardCrops = CROP_CATEGORIES.flatMap((c) => c.crops);

  const [isCustom, setIsCustom] = useState(() => {
    return value && !allStandardCrops.includes(value);
  });

  const [customCrop, setCustomCrop] = useState(() => {
    return isCustom ? value : '';
  });

  const handleSelectChange = (e) => {
    const val = e.target.value;
    if (val === 'OTHER_CUSTOM') {
      setIsCustom(true);
      onChange(customCrop || '');
    } else {
      setIsCustom(false);
      onChange(val);
    }
  };

  const handleCustomTextChange = (e) => {
    const val = e.target.value.slice(0, 60);
    setCustomCrop(val);
    onChange(val);
  };

  return (
    <FormField label="Crop Name" htmlFor="crop" required={required} error={error}>
      <div className="space-y-2">
        <Select
          id="crop"
          value={isCustom ? 'OTHER_CUSTOM' : value || ''}
          onChange={handleSelectChange}
          hasError={!!error}
        >
          <option value="">-- Choose Crop --</option>
          {CROP_CATEGORIES.map((cat) => (
            <optgroup key={cat.category} label={cat.category}>
              {cat.crops.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </optgroup>
          ))}
          <option value="OTHER_CUSTOM">Other (Type custom crop name)</option>
        </Select>

        {isCustom && (
          <Input
            placeholder="Type custom crop name (e.g. Dragonfruit, Vanilla)"
            value={customCrop}
            onChange={handleCustomTextChange}
            maxLength={60}
            hasError={!!error}
            autoFocus
          />
        )}
      </div>
    </FormField>
  );
}
