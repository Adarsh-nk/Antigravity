import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Select } from '../ui/Select.jsx';
import { FormField } from '../ui/FormField.jsx';

export function FarmSelect({ farms = [], value, onChange, error, required = true }) {
  return (
    <FormField
      label="Select Target Farm"
      htmlFor="farm_id"
      required={required}
      error={error}
      hint="Advice will be customized using this farm's soil, location, and irrigation details."
    >
      <div className="space-y-1.5">
        <Select
          id="farm_id"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          hasError={!!error}
        >
          <option value="">-- Choose Farm --</option>
          {farms.map((farm) => (
            <option key={farm.id} value={farm.id}>
              {farm.name} ({farm.area} {farm.area_unit}s - {farm.district}, {farm.state})
            </option>
          ))}
        </Select>
        <div className="flex justify-end">
          <Link
            to="/farms/new"
            className="inline-flex items-center text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <PlusCircle className="w-3.5 h-3.5 mr-1" />
            Add a new farm
          </Link>
        </div>
      </div>
    </FormField>
  );
}
