import React, { useState } from 'react';
import { Camera, Upload, X, CheckCircle, AlertCircle } from 'lucide-react';
import { processAndResizeImage } from '../../lib/imageResize.js';
import { Spinner } from '../ui/Spinner.jsx';

export function ImageUploader({ onImageChange, error }) {
  const [preview, setPreview] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalError(null);
    setIsProcessing(true);

    try {
      const processed = await processAndResizeImage(file);
      if (processed) {
        setPreview(processed.previewUrl);
        onImageChange(processed.file);
      }
    } catch (err) {
      setLocalError(err.message || 'Failed to process image');
      onImageChange(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    setLocalError(null);
    onImageChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-slate-800">
        Upload Plant Photo <span className="text-xs font-normal text-slate-500">(Optional, Max 4MB)</span>
      </label>

      {preview ? (
        <div className="relative inline-block border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-slate-900">
          <img src={preview} alt="Plant Preview" className="h-48 w-auto object-cover max-w-full" />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 bg-slate-900/80 hover:bg-red-600 text-white rounded-full backdrop-blur-xs transition-colors cursor-pointer"
            title="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-emerald-800/90 text-white rounded-lg text-xs font-semibold flex items-center gap-1">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Optimized & Ready
          </div>
        </div>
      ) : (
        <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition-colors bg-white">
          {isProcessing ? (
            <div className="flex flex-col items-center justify-center py-4 text-emerald-600 space-y-2">
              <Spinner size="md" />
              <span className="text-xs font-semibold">Optimizing plant photo...</span>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center gap-3">
                <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
                  <Camera className="w-6 h-6" />
                </div>
                <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl">
                  <Upload className="w-6 h-6" />
                </div>
              </div>
              <div>
                <label className="cursor-pointer inline-flex items-center px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-colors">
                  Take Photo / Choose Image
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="sr-only"
                  />
                </label>
              </div>
              <p className="text-xs text-slate-500">
                JPEG, PNG, or WebP up to 4 MB. Clear photos of leaves, stems, or fruit increase diagnosis accuracy.
              </p>
            </div>
          )}
        </div>
      )}

      {(localError || error) && (
        <p className="text-xs font-medium text-red-600 flex items-center gap-1">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {localError || error}
        </p>
      )}
    </div>
  );
}
