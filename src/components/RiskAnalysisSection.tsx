import React from 'react';
import { InputField, CheckboxField } from './FormFields';

interface RiskAnalysisProps {
  title: string;
  data: {
    fechaActualizacion: string;
    scoring: string;
    probabilidadMora: boolean;
  };
  onChange: (field: string, value: string | boolean) => void;
  namePrefix: string;
}

/**
 * Risk Analysis Section Component (CIFIN, Datacredito, etc.)
 */
export const RiskAnalysisSection: React.FC<RiskAnalysisProps> = ({
  title,
  data,
  onChange,
  namePrefix,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const fieldName = name.replace(`${namePrefix}_`, '');
    const fieldValue = type === 'checkbox' ? checked : value;
    onChange(fieldName, fieldValue);
  };

  return (
    <div className="risk-analysis-section">
      <h4 className="risk-title">{title}</h4>
      <div className="risk-fields-horizontal">
        <div className="risk-field-group">
          <span className="risk-label">Última actualización</span>
          <InputField
            label=""
            name={`${namePrefix}_fechaActualizacion`}
            type="date"
            value={data.fechaActualizacion}
            onChange={handleChange}
            className="risk-date-field"
          />
        </div>
        <div className="risk-field-group">
          <span className="risk-label">Scoring</span>
          <InputField
            label=""
            name={`${namePrefix}_scoring`}
            type="number"
            value={data.scoring}
            onChange={handleChange}
            className="risk-scoring-field"
          />
        </div>
        <div className="risk-field-group">
          <span className="risk-label">Probabilidad mora alta</span>
          <div className="risk-input-with-indicator">
            <CheckboxField
              label=""
              name={`${namePrefix}_probabilidadMora`}
              checked={data.probabilidadMora}
              onChange={handleChange}
              className="risk-probability-checkbox"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysisSection;
