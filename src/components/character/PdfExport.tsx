import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileUp, Download, Eye, FileText } from 'lucide-react';
import type { Character } from '../../types/character';
import { 
  scanPdfFields, 
  fillCharacterSheet, 
  downloadPdf, 
  previewPdf,
  getUnmappedFields 
} from '../../services/pdfService';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface PdfExportProps {
  character: Character;
}

export const PdfExport: React.FC<PdfExportProps> = ({ character }) => {
  const { t } = useTranslation();
  const [pdfTemplate, setPdfTemplate] = useState<ArrayBuffer | null>(null);
  const [templateName, setTemplateName] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [fieldCount, setFieldCount] = useState<number>(0);
  const [unmappedCount, setUnmappedCount] = useState<number>(0);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setTemplateName(file.name);

    try {
      const arrayBuffer = await file.arrayBuffer();
      setPdfTemplate(arrayBuffer);

      // Scan fields
      const fields = await scanPdfFields(arrayBuffer);
      const unmapped = await getUnmappedFields(arrayBuffer);
      
      setFieldCount(fields.length);
      setUnmappedCount(unmapped.length);

      console.log('PDF Template loaded:', file.name);
      console.log(`Total fields: ${fields.length}`);
      console.log(`Unmapped fields (${unmapped.length}):`, unmapped);
    } catch (error) {
      console.error('Error loading PDF template:', error);
      alert('Failed to load PDF template. Please ensure it\'s a valid PDF with form fields.');
      setPdfTemplate(null);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleExportPdf = async () => {
    if (!pdfTemplate) {
      alert('Please upload a PDF template first');
      return;
    }

    setIsProcessing(true);

    try {
      const filledPdf = await fillCharacterSheet(pdfTemplate, character);
      const filename = `${character.name.replace(/\s+/g, '_')}_Character_Sheet.pdf`;
      downloadPdf(filledPdf, filename);
    } catch (error) {
      console.error('Error exporting PDF:', error);
      alert('Failed to export character sheet');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePreviewPdf = async () => {
    if (!pdfTemplate) {
      alert('Please upload a PDF template first');
      return;
    }

    setIsProcessing(true);

    try {
      const filledPdf = await fillCharacterSheet(pdfTemplate, character);
      previewPdf(filledPdf);
    } catch (error) {
      console.error('Error previewing PDF:', error);
      alert('Failed to preview character sheet');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card variant="parchment">
      <Card.Header>
        <h3 className="text-lg font-heading font-semibold flex items-center gap-2 text-parchment-900 dark:text-parchment-100">
          <FileText className="w-5 h-5" />
          PDF Character Sheet Export
        </h3>
      </Card.Header>
      
      <Card.Content>
        <div className="space-y-4">
          {/* Upload Template */}
          <div>
            <label 
              htmlFor="pdf-upload" 
              className="block text-sm font-medium text-parchment-700 dark:text-parchment-300 mb-2"
            >
              Upload PDF Template
            </label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="pdf-upload"
                className="flex items-center gap-2 px-4 py-2 bg-parchment-200 dark:bg-dark-border hover:bg-parchment-300 dark:hover:bg-parchment-800 transition-colors rounded cursor-pointer border border-parchment-400 dark:border-dark-border"
              >
                <FileUp className="w-4 h-4" />
                <span className="text-sm font-body">
                  {templateName || 'Choose PDF Template'}
                </span>
              </label>
              <input
                id="pdf-upload"
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
            
            {pdfTemplate && (
              <div className="mt-2 text-sm text-parchment-600 dark:text-parchment-400">
                <p>✓ Template loaded: <span className="font-medium">{templateName}</span></p>
                <p>✓ Total form fields: <span className="font-medium">{fieldCount}</span></p>
                {unmappedCount > 0 && (
                  <p className="text-burgundy-600 dark:text-burgundy-400">
                    ⚠ {unmappedCount} fields not mapped (check console for details)
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Export Actions */}
          {pdfTemplate && (
            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                onClick={handleExportPdf}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isProcessing ? 'Processing...' : 'Download PDF'}
              </Button>
              
              <Button
                variant="secondary"
                onClick={handlePreviewPdf}
                disabled={isProcessing}
                className="flex items-center gap-2"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Button>
            </div>
          )}

          {/* Info */}
          <div className="p-3 bg-forest-50 dark:bg-forest-900/20 border border-forest-200 dark:border-forest-800 rounded text-sm text-forest-800 dark:text-forest-300">
            <p className="font-medium mb-1">How to use:</p>
            <ol className="list-decimal list-inside space-y-1 text-xs">
              <li>Upload a D&D 5E character sheet PDF template with form fields</li>
              <li>The system will automatically map your character data to PDF fields</li>
              <li>Click "Download PDF" to save or "Preview" to view in browser</li>
            </ol>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};
