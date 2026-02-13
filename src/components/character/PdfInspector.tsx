import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileSearch, AlertTriangle } from 'lucide-react';
import { scanPdfFields, getUnmappedFields, PDF_FIELD_MAPPING } from '../../services/pdfService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

/**
 * PDF Template Inspector Component
 * Allows developers to upload PDF templates and see which fields are mapped/unmapped
 */
export const PdfInspector: React.FC = () => {
  const { t } = useTranslation();
  const [allFields, setAllFields] = useState<string[]>([]);
  const [unmappedFields, setUnmappedFields] = useState<string[]>([]);
  const [mappedFields, setMappedFields] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleScan = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);
    setFileName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      
      const fields = await scanPdfFields(arrayBuffer);
      const unmapped = await getUnmappedFields(arrayBuffer);
      const mapped = fields.filter(f => !unmapped.includes(f));

      setAllFields(fields);
      setUnmappedFields(unmapped);
      setMappedFields(mapped);

      console.log('=== PDF FIELD SCAN RESULTS ===');
      console.log(`File: ${file.name}`);
      console.log(`Total fields: ${fields.length}`);
      console.log(`Mapped: ${mapped.length}`);
      console.log(`Unmapped: ${unmapped.length}`);
      console.log('\nAll fields:', fields);
      console.log('\nUnmapped fields:', unmapped);
    } catch (error) {
      console.error('Error scanning PDF:', error);
      alert('Failed to scan PDF. Ensure it has form fields.');
    } finally {
      setIsScanning(false);
    }
  };

  const mappingCoverage = allFields.length > 0 
    ? ((mappedFields.length / allFields.length) * 100).toFixed(1)
    : '0';

  return (
    <Card variant="parchment">
      <Card.Header>
        <h3 className="text-lg font-heading font-semibold flex items-center gap-2 text-parchment-900 dark:text-parchment-100">
          <FileSearch className="w-5 h-5" />
          PDF Template Inspector
        </h3>
        <p className="text-sm text-parchment-600 dark:text-parchment-400 mt-1">
          Scan PDF templates to see field mappings
        </p>
      </Card.Header>
      
      <Card.Content>
        <div className="space-y-4">
          {/* Upload Button */}
          <div>
            <label
              htmlFor="pdf-inspector"
              className="inline-flex items-center gap-2 px-4 py-2 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded cursor-pointer transition-colors"
            >
              <FileSearch className="w-4 h-4" />
              {isScanning ? 'Scanning...' : 'Scan PDF Template'}
            </label>
            <input
              id="pdf-inspector"
              type="file"
              accept=".pdf"
              onChange={handleScan}
              className="hidden"
              disabled={isScanning}
            />
          </div>

          {/* Results */}
          {allFields.length > 0 && (
            <div className="space-y-4">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-parchment-100 dark:bg-dark-surface border border-parchment-300 dark:border-dark-border rounded text-center">
                  <div className="text-2xl font-heading font-bold text-parchment-900 dark:text-parchment-100">
                    {allFields.length}
                  </div>
                  <div className="text-xs text-parchment-600 dark:text-parchment-400">
                    Total Fields
                  </div>
                </div>
                
                <div className="p-3 bg-forest-50 dark:bg-forest-900/20 border border-forest-300 dark:border-forest-800 rounded text-center">
                  <div className="text-2xl font-heading font-bold text-forest-700 dark:text-forest-400">
                    {mappedFields.length}
                  </div>
                  <div className="text-xs text-forest-600 dark:text-forest-500">
                    Mapped ({mappingCoverage}%)
                  </div>
                </div>
                
                <div className="p-3 bg-burgundy-50 dark:bg-burgundy-900/20 border border-burgundy-300 dark:border-burgundy-800 rounded text-center">
                  <div className="text-2xl font-heading font-bold text-burgundy-700 dark:text-burgundy-400">
                    {unmappedFields.length}
                  </div>
                  <div className="text-xs text-burgundy-600 dark:text-burgundy-500">
                    Unmapped
                  </div>
                </div>
              </div>

              {/* Unmapped Fields Warning */}
              {unmappedFields.length > 0 && (
                <div className="p-4 bg-burgundy-50 dark:bg-burgundy-900/20 border border-burgundy-300 dark:border-burgundy-800 rounded">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-burgundy-600 dark:text-burgundy-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-burgundy-900 dark:text-burgundy-200">
                        Unmapped Fields Found
                      </p>
                      <p className="text-sm text-burgundy-700 dark:text-burgundy-300 mt-1">
                        The following fields exist in the PDF but don't have mappings in the code:
                      </p>
                      <div className="mt-2 max-h-40 overflow-y-auto">
                        <ul className="text-xs font-mono space-y-1">
                          {unmappedFields.map(field => (
                            <li key={field} className="text-burgundy-800 dark:text-burgundy-300">
                              • {field}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Mapped Fields */}
              <div>
                <h4 className="text-sm font-medium text-parchment-700 dark:text-parchment-300 mb-2">
                  Mapped Fields ({mappedFields.length})
                </h4>
                <div className="max-h-60 overflow-y-auto p-3 bg-parchment-50 dark:bg-dark-surface border border-parchment-300 dark:border-dark-border rounded">
                  <ul className="text-xs font-mono space-y-1">
                    {mappedFields.map(field => (
                      <li key={field} className="text-forest-700 dark:text-forest-400">
                        ✓ {field}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* File Info */}
              <p className="text-xs text-parchment-600 dark:text-parchment-400 text-center">
                Scanned: {fileName}
              </p>
            </div>
          )}

          {/* Instructions */}
          {allFields.length === 0 && (
            <div className="p-4 bg-parchment-100 dark:bg-dark-surface border border-parchment-300 dark:border-dark-border rounded text-sm text-parchment-700 dark:text-parchment-300">
              <p className="font-medium mb-2">Developer Tool</p>
              <p className="text-xs">
                Upload a PDF template to see which form fields are automatically mapped to Character data.
                Unmapped fields will need to be added to <code className="px-1 bg-parchment-200 dark:bg-dark-border rounded">PDF_FIELD_MAPPING</code> in <code className="px-1 bg-parchment-200 dark:bg-dark-border rounded">pdfService.ts</code>.
              </p>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  );
};
