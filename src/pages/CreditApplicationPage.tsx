import React, { useState } from 'react';
import { InputField, SelectField } from '../components/FormFields';
import { RiskAnalysisSection } from '../components/RiskAnalysisSection';
import { Button } from '../components/Button';
import { calculateLoanPayment, formatCurrency } from '../utils';
import { creditApplicationService } from '../services';
import type { CreditFormData } from '../types';
import '../styles/CreditApplication.css';

/**
 * Credit Application Page - Main form for credit requests
 */
const CreditApplicationPage: React.FC = () => {
  const [formData, setFormData] = useState<CreditFormData>({
    // Datos del solicitante
    identificacion: '60337388',
    nombre: 'CONTRERAS GELVES PATRICIA',
    numeroSolicitud: 'SOL-2025-001',
    tipoCredito: 'C08 ORDINARIO CON LIBRANZA',
    
    // Información del crédito
    valorSolicitado: '1000000',
    cupoLinea: '40000000',
    plazo: '12',
    tasa: '14.4',
    tasaSeguro: '0.5',
    formaPago: 'Nomina',
    frecuencia: 'Mensual',
    fechaPrimerPago: '2025-09-01',
    modalidadCuota: 'Vencida',
    linea: '001',                    // Línea de crédito
    valorCobros: '0',                // Valor de cobros
    pagaduria: 'ENTIDAD_PUBLICA',    // Pagaduría
    
    // Análisis de riesgo
    cifin: {
      fechaActualizacion: '2025-07-16',
      scoring: '908',
      probabilidadMora: false,
    },
    datacredito: {
      fechaActualizacion: '2025-07-16',
      scoring: '850',
      probabilidadMora: false,
    },
    comportamientoEntidad: {
      fechaActualizacion: '2025-07-16',
      procesosJuridicos: 0,
      scoring: '920',
      probabilidadMora: false,
    },
    
    // Codeudores
    codeudores: {
      codeudor1: {
        identificacion: '12345678',
        nombre: 'GARCÍA LÓPEZ MARÍA JOSÉ',
        telefono: '3001234567',
        email: 'maria.garcia@email.com',
        ingresos: '2500000',
        patrimonio: '15000000',
      },
      codeudor2: {
        identificacion: '87654321',
        nombre: 'RODRÍGUEZ PÉREZ CARLOS ANDRÉS',
        telefono: '3109876543',
        email: 'carlos.rodriguez@email.com',
        ingresos: '3200000',
        patrimonio: '25000000',
      },
    },
    
    // Garantías
    garantias: {
      codClaseGarantia: 'HIP',
      valor: '50000000',
      descripcionGarantia: 'Vivienda ubicada en Bogotá, Zona Norte',
      numeroPoliza: 'POL-2025-123456',
      encargadoEvaluarGarantia: 'ANALISTA SENIOR',
    },
    
    // Configuración adicional
    tipoSistemaAmortizacion: 'FRANCES',  // Francés
    codDestinoCredito: '001',
    cuotaAdministracion: '15000',
    
    // Campos adicionales requeridos por el backend
    detalle: 'Solicitud de crédito ordinario con libranza para compra de vivienda',
    usuario: 'SISTEMA',              // Usuario que crea la solicitud
    terminal: 'WEB001',              // Terminal desde donde se crea
  });

  const [activeTab, setActiveTab] = useState<'basicos' | 'capacidad' | 'codeudores' | 'adicionales'>('basicos');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleRiskChange = (section: 'cifin' | 'datacredito' | 'comportamientoEntidad', field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleCodeudorChange = (codeudor: 'codeudor1' | 'codeudor2', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      codeudores: {
        ...prev.codeudores,
        [codeudor]: {
          ...prev.codeudores[codeudor],
          [field]: value
        }
      }
    }));
  };

  const handleGarantiaChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      garantias: {
        ...prev.garantias,
        [field]: value
      }
    }));
  };

  const getBackendData = () => {
    // Mapeo exacto de campos del formulario al JSON que espera la API
    return {
      // Campos principales - convertir a números según la API
      nit: parseInt(formData.identificacion) || 0,
      valor_solicitado: parseFloat(formData.valorSolicitado) || 0,
      plazo: parseInt(formData.plazo) || 0,
      tasa: parseFloat(formData.tasa) || 0,
      linea: formData.linea || "001",
      valor_cobros: parseFloat(formData.valorCobros) || 0,
      pagaduria: 1, // Convertir a número según API
      
      // Codeudores - convertir a números
      codeudor1: parseInt(formData.codeudores.codeudor1.identificacion) || 0,
      codeudor2: parseInt(formData.codeudores.codeudor2.identificacion) || 0,
      
      // Valor cuota calculado
      valor_cuota: calculateLoanPayment(
        parseFloat(formData.valorSolicitado) || 0,
        parseFloat(formData.tasa) || 0,
        parseInt(formData.plazo) || 1
      ),
      
      // Estados del crédito - usar formato de caracteres
      completo: "N", // Siempre N para nueva solicitud
      aprobado: "N", // Siempre N para nueva solicitud
      detalle: formData.detalle || "Solicitud en evaluación",
      devengado: 0,
      deducido: 0,
      
      // Fechas en formato ISO
      fecha: new Date().toISOString().slice(0, 19), // Formato: "2025-07-16T10:30:00"
      fecha_primer_pago: formData.fechaPrimerPago ? 
        new Date(formData.fechaPrimerPago).toISOString().slice(0, 19) : 
        new Date().toISOString().slice(0, 19),
      impreso: "N",
      
      // Configuración de pago - convertir a números
      forma_pago: 1, // Mapear según tipo de forma de pago
      frecuencia: 30, // Días (mensual = 30)
      
      // Usuario y terminal
      usuario: formData.usuario || "admin",
      terminal: formData.terminal || "TERM001",
      
      // Garantías - convertir códigos a números
      cod_clase_garantia: getCodigoClaseGarantia(formData.garantias.codClaseGarantia),
      valor: parseFloat(formData.garantias.valor) || 0,
      descripcion_garantia: formData.garantias.descripcionGarantia || "",
      encargado_evaluar_garantia: formData.garantias.encargadoEvaluarGarantia || "evaluador1",
      
      // Configuración del crédito - convertir a números
      tipo_sistema_amortizacion: getTipoSistemaAmortizacion(formData.tipoSistemaAmortizacion),
      cod_destino_credito: parseInt(formData.codDestinoCredito) || 101,
      modalidad_cuota: getModalidadCuota(formData.modalidadCuota),
      numero_poliza: formData.garantias.numeroPoliza || "",
      tasa_seguro: parseFloat(formData.tasaSeguro) || 0,
      cuota_administracion: parseFloat(formData.cuotaAdministracion) || 0,
    };
  };

  // Funciones auxiliares para mapear valores
  const getCodigoClaseGarantia = (codigo: string): number => {
    const mapeo = {
      'HIP': 1, // Hipotecaria
      'PRE': 2, // Prendaria
      'FID': 3, // Fiduciaria
      'PER': 4, // Personal
    };
    return mapeo[codigo as keyof typeof mapeo] || 1;
  };

  const getTipoSistemaAmortizacion = (tipo: string): number => {
    const mapeo = {
      'FRANCES': 1,
      'ALEMAN': 2,
      'AMERICANO': 3,
    };
    return mapeo[tipo as keyof typeof mapeo] || 1;
  };

  const getModalidadCuota = (modalidad: string): string => {
    const mapeo = {
      'Vencida': 'F',
      'Anticipada': 'A',
    };
    return mapeo[modalidad as keyof typeof mapeo] || 'F';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevenir múltiples envíos
    
    setIsSubmitting(true);
    
    try {
      // Obtener datos para la API
      const apiData = getBackendData();
      
      console.log('Datos originales del formulario:', formData);
      console.log('Datos para enviar a la API:', apiData);
      
      // Validar datos antes de enviar
      const validation = creditApplicationService.validateCreditData(apiData);
      if (!validation.valid) {
        console.error('Errores de validación:', validation.errors);
        alert(`Errores de validación:\n${validation.errors.join('\n')}`);
        return;
      }
      
      // Enviar datos al backend
      console.log('Enviando solicitud al backend...');
      const response = await creditApplicationService.submitCreditApplication(apiData);
      
      if (response.success) {
        console.log('Solicitud enviada exitosamente:', response);
        let successMessage = '¡Solicitud de crédito enviada exitosamente!';
        
        if (response.id_referencia) {
          successMessage += `\n\nID de referencia: ${response.id_referencia}`;
        }
        
        if (response.timestamp) {
          const fecha = new Date(response.timestamp).toLocaleString('es-CO');
          successMessage += `\nFecha: ${fecha}`;
        }
        
        alert(successMessage);
        
        // Opcional: Limpiar formulario o redirigir
        // setFormData(initialFormData);
        
      } else {
        console.error('Error del backend:', response);
        alert(`Error al enviar la solicitud:\n${response.message}`);
      }
      
    } catch (error) {
      console.error('Error inesperado:', error);
      alert('Error inesperado al procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateQuota = () => {
    const valor = parseFloat(formData.valorSolicitado) || 0;
    const tasa = parseFloat(formData.tasa) || 0;
    const plazo = parseInt(formData.plazo) || 1;
    
    const cuota = calculateLoanPayment(valor, tasa, plazo);
    return formatCurrency(cuota);
  };

  const tipoPrestamoOptions = [
    { value: 'C08', label: 'C08 ORDINARIO CON LIBRANZA' },
    { value: 'C09', label: 'C09 CONSUMO' },
    { value: 'C10', label: 'C10 VIVIENDA' },
  ];

  const formaPagoOptions = [
    { value: 'Nomina', label: 'Nómina' },
    { value: 'Caja', label: 'Caja' },
    { value: 'Transferencia', label: 'Transferencia' },
  ];

  const frecuenciaOptions = [
    { value: 'Mensual', label: 'Mensual' },
    { value: 'Quincenal', label: 'Quincenal' },
    { value: 'Semanal', label: 'Semanal' },
  ];

  const modalidadCuotaOptions = [
    { value: 'Vencida', label: 'Vencida' },
    { value: 'Anticipada', label: 'Anticipada' },
  ];

  return (
    <div className="credit-application-page">
      <div className="form-header">
        <h1 className="form-title">🏦 Solicitud de crédito</h1>
      </div>

      <form onSubmit={handleSubmit} className="credit-form">
        {/* Información básica del solicitante */}
        <section className="form-section basic-info">
          <div className="form-row">
            <InputField
              label="Identificación"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleInputChange}
              required
              className="field-small"
            />
            <SelectField
              label="Tipo préstamo"
              name="tipoCredito"
              value={formData.tipoCredito}
              onChange={handleInputChange}
              options={tipoPrestamoOptions}
              required
              className="field-large"
            />
          </div>
          
          <div className="form-row">
            <InputField
              label="Nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              required
              className="field-large"
            />
            <InputField
              label="Número solicitud"
              name="numeroSolicitud"
              value={formData.numeroSolicitud}
              onChange={handleInputChange}
              className="field-small"
            />
          </div>
        </section>

        {/* Tabs de criterios */}
        <section className="criteria-tabs">
          <div className="tab-headers">
            <button
              type="button"
              className={`tab-header ${activeTab === 'basicos' ? 'active' : ''}`}
              onClick={() => setActiveTab('basicos')}
            >
              Datos básicos
            </button>
            <button
              type="button"
              className={`tab-header ${activeTab === 'capacidad' ? 'active' : ''}`}
              onClick={() => setActiveTab('capacidad')}
            >
              Capacidad de pago
            </button>
            <button
              type="button"
              className={`tab-header ${activeTab === 'codeudores' ? 'active' : ''}`}
              onClick={() => setActiveTab('codeudores')}
            >
              Codeudores
            </button>
            <button
              type="button"
              className={`tab-header ${activeTab === 'adicionales' ? 'active' : ''}`}
              onClick={() => setActiveTab('adicionales')}
            >
              Adicionales
            </button>
            <button
              type="button"
              className="tab-header disabled"
              disabled
              title="Funcionalidad disponible próximamente"
            >
              Concepto analista
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'basicos' && (
              <div className="basicos-content">
                <h3>Información del Crédito</h3>
                
                <div className="form-grid">
                  <SelectField
                    label="Forma pago"
                    name="formaPago"
                    value={formData.formaPago}
                    onChange={handleInputChange}
                    options={formaPagoOptions}
                    required
                  />
                  
                  <InputField
                    label="Cupo de la línea"
                    name="cupoLinea"
                    value={formData.cupoLinea}
                    onChange={handleInputChange}
                    disabled
                  />
                  
                  <SelectField
                    label="Frecuencia"
                    name="frecuencia"
                    value={formData.frecuencia}
                    onChange={handleInputChange}
                    options={frecuenciaOptions}
                    required
                  />
                  
                  <InputField
                    label="Plazo"
                    name="plazo"
                    type="number"
                    value={formData.plazo}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <InputField
                    label="Valor a solicitar"
                    name="valorSolicitado"
                    type="number"
                    value={formData.valorSolicitado}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <InputField
                    label="Fecha primer pago"
                    name="fechaPrimerPago"
                    type="date"
                    value={formData.fechaPrimerPago}
                    onChange={handleInputChange}
                    required
                  />
                  
                  <SelectField
                    label="Modalidad cuota"
                    name="modalidadCuota"
                    value={formData.modalidadCuota}
                    onChange={handleInputChange}
                    options={modalidadCuotaOptions}
                    required
                  />
                </div>
                
                <div className="interest-section">
                  <div className="interest-row">
                    <InputField
                      label="Tasa"
                      name="tasa"
                      type="number"
                      value={formData.tasa}
                      onChange={handleInputChange}
                      required
                      className="field-small"
                    />
                    <InputField
                      label="Tasa Seguro"
                      name="tasaSeguro"
                      type="number"
                      value={formData.tasaSeguro}
                      onChange={handleInputChange}
                      className="field-small"
                    />
                    <button type="button" className="btn-secondary">
                      Habilitar Seg x codeudor
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'capacidad' && (
              <div className="capacity-content">
                <h3>Niveles de riesgo</h3>
                
                <RiskAnalysisSection
                  title="Cifin"
                  data={formData.cifin}
                  onChange={(field, value) => handleRiskChange('cifin', field, value)}
                  namePrefix="cifin"
                />
                
                <RiskAnalysisSection
                  title="Datacredito"
                  data={formData.datacredito}
                  onChange={(field, value) => handleRiskChange('datacredito', field, value)}
                  namePrefix="datacredito"
                />
                
                <RiskAnalysisSection
                  title="Comportamiento entidad"
                  data={formData.comportamientoEntidad}
                  onChange={(field, value) => handleRiskChange('comportamientoEntidad', field, value)}
                  namePrefix="comportamientoEntidad"
                />
                
                <div className="procesos-juridicos-info">
                  <span className="info-label">Procesos jurídicos: {formData.comportamientoEntidad.procesosJuridicos}</span>
                </div>
              </div>
            )}

            {activeTab === 'codeudores' && (
              <div className="codeudores-content">
                <h3>Información de Codeudores</h3>
                
                {/* Codeudor 1 */}
                <div className="codeudor-section">
                  <h4>Codeudor 1</h4>
                  <div className="form-row">
                    <InputField
                      label="Identificación"
                      name="codeudor1_identificacion"
                      value={formData.codeudores.codeudor1.identificacion}
                      onChange={(e) => handleCodeudorChange('codeudor1', 'identificacion', e.target.value)}
                      placeholder="Número de identificación"
                    />
                    <InputField
                      label="Nombre completo"
                      name="codeudor1_nombre"
                      value={formData.codeudores.codeudor1.nombre}
                      onChange={(e) => handleCodeudorChange('codeudor1', 'nombre', e.target.value)}
                      placeholder="Nombre completo del codeudor"
                      className="field-large"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Teléfono"
                      name="codeudor1_telefono"
                      value={formData.codeudores.codeudor1.telefono}
                      onChange={(e) => handleCodeudorChange('codeudor1', 'telefono', e.target.value)}
                      placeholder="Número de teléfono"
                    />
                    <InputField
                      label="Email"
                      name="codeudor1_email"
                      type="email"
                      value={formData.codeudores.codeudor1.email}
                      onChange={(e) => handleCodeudorChange('codeudor1', 'email', e.target.value)}
                      placeholder="Correo electrónico"
                      className="field-large"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Ingresos"
                      name="codeudor1_ingresos"
                      type="number"
                      value={formData.codeudores.codeudor1.ingresos}
                      onChange={(e) => handleCodeudorChange('codeudor1', 'ingresos', e.target.value)}
                      placeholder="Ingresos mensuales"
                    />
                    <InputField
                      label="Patrimonio"
                      name="codeudor1_patrimonio"
                      type="number"
                      value={formData.codeudores.codeudor1.patrimonio}
                      onChange={(e) => handleCodeudorChange('codeudor1', 'patrimonio', e.target.value)}
                      placeholder="Patrimonio total"
                    />
                  </div>
                </div>

                {/* Codeudor 2 */}
                <div className="codeudor-section">
                  <h4>Codeudor 2</h4>
                  <div className="form-row">
                    <InputField
                      label="Identificación"
                      name="codeudor2_identificacion"
                      value={formData.codeudores.codeudor2.identificacion}
                      onChange={(e) => handleCodeudorChange('codeudor2', 'identificacion', e.target.value)}
                      placeholder="Número de identificación"
                    />
                    <InputField
                      label="Nombre completo"
                      name="codeudor2_nombre"
                      value={formData.codeudores.codeudor2.nombre}
                      onChange={(e) => handleCodeudorChange('codeudor2', 'nombre', e.target.value)}
                      placeholder="Nombre completo del codeudor"
                      className="field-large"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Teléfono"
                      name="codeudor2_telefono"
                      value={formData.codeudores.codeudor2.telefono}
                      onChange={(e) => handleCodeudorChange('codeudor2', 'telefono', e.target.value)}
                      placeholder="Número de teléfono"
                    />
                    <InputField
                      label="Email"
                      name="codeudor2_email"
                      type="email"
                      value={formData.codeudores.codeudor2.email}
                      onChange={(e) => handleCodeudorChange('codeudor2', 'email', e.target.value)}
                      placeholder="Correo electrónico"
                      className="field-large"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Ingresos"
                      name="codeudor2_ingresos"
                      type="number"
                      value={formData.codeudores.codeudor2.ingresos}
                      onChange={(e) => handleCodeudorChange('codeudor2', 'ingresos', e.target.value)}
                      placeholder="Ingresos mensuales"
                    />
                    <InputField
                      label="Patrimonio"
                      name="codeudor2_patrimonio"
                      type="number"
                      value={formData.codeudores.codeudor2.patrimonio}
                      onChange={(e) => handleCodeudorChange('codeudor2', 'patrimonio', e.target.value)}
                      placeholder="Patrimonio total"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'adicionales' && (
              <div className="adicionales-content">
                <h3>Información Adicional</h3>
                
                {/* Garantías */}
                <div className="garantias-section">
                  <h4>Garantías</h4>
                  <div className="form-row">
                    <SelectField
                      label="Código clase garantía"
                      name="codClaseGarantia"
                      value={formData.garantias.codClaseGarantia}
                      onChange={(e) => handleGarantiaChange('codClaseGarantia', e.target.value)}
                      options={[
                        { value: 'HIP', label: 'Hipotecaria' },
                        { value: 'PRE', label: 'Prendaria' },
                        { value: 'FID', label: 'Fiduciaria' },
                        { value: 'PER', label: 'Personal' },
                      ]}
                    />
                    <InputField
                      label="Valor de la garantía"
                      name="valor"
                      type="number"
                      value={formData.garantias.valor}
                      onChange={(e) => handleGarantiaChange('valor', e.target.value)}
                      placeholder="Valor de la garantía"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Descripción garantía"
                      name="descripcionGarantia"
                      value={formData.garantias.descripcionGarantia}
                      onChange={(e) => handleGarantiaChange('descripcionGarantia', e.target.value)}
                      placeholder="Descripción detallada de la garantía"
                      className="field-large"
                    />
                    <InputField
                      label="Número póliza"
                      name="numeroPoliza"
                      value={formData.garantias.numeroPoliza}
                      onChange={(e) => handleGarantiaChange('numeroPoliza', e.target.value)}
                      placeholder="Número de póliza de seguro"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Encargado evaluar garantía"
                      name="encargadoEvaluarGarantia"
                      value={formData.garantias.encargadoEvaluarGarantia}
                      onChange={(e) => handleGarantiaChange('encargadoEvaluarGarantia', e.target.value)}
                      placeholder="Analista responsable"
                    />
                  </div>
                </div>

                {/* Configuración del crédito */}
                <div className="config-section">
                  <h4>Configuración del Crédito</h4>
                  <div className="form-row">
                    <SelectField
                      label="Tipo sistema amortización"
                      name="tipoSistemaAmortizacion"
                      value={formData.tipoSistemaAmortizacion}
                      onChange={handleInputChange}
                      options={[
                        { value: 'FRANCES', label: 'Francés' },
                        { value: 'ALEMAN', label: 'Alemán' },
                        { value: 'AMERICANO', label: 'Americano' },
                      ]}
                    />
                    <InputField
                      label="Código destino crédito"
                      name="codDestinoCredito"
                      value={formData.codDestinoCredito}
                      onChange={handleInputChange}
                      placeholder="Código de destino"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Cuota administración"
                      name="cuotaAdministracion"
                      type="number"
                      value={formData.cuotaAdministracion}
                      onChange={handleInputChange}
                      placeholder="Valor cuota de administración"
                    />
                    <InputField
                      label="Pagaduría"
                      name="pagaduria"
                      value={formData.pagaduria}
                      onChange={handleInputChange}
                      placeholder="Entidad pagadora"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Línea de crédito"
                      name="linea"
                      value={formData.linea}
                      onChange={handleInputChange}
                      placeholder="Código línea (3 caracteres)"
                    />
                    <InputField
                      label="Valor cobros"
                      name="valorCobros"
                      type="number"
                      value={formData.valorCobros}
                      onChange={handleInputChange}
                      placeholder="Valor de cobros adicionales"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Detalle del crédito"
                      name="detalle"
                      value={formData.detalle}
                      onChange={handleInputChange}
                      placeholder="Descripción detallada del crédito"
                      className="field-large"
                    />
                  </div>
                  <div className="form-row">
                    <InputField
                      label="Usuario"
                      name="usuario"
                      value={formData.usuario}
                      onChange={handleInputChange}
                      placeholder="Usuario responsable"
                    />
                    <InputField
                      label="Terminal"
                      name="terminal"
                      value={formData.terminal}
                      onChange={handleInputChange}
                      placeholder="Terminal de origen"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>



        {/* Valor cuota calculado */}
        <section className="quota-section">
          <div className="quota-display">
            <h3>Valor cuota</h3>
            <div className="quota-amount">{calculateQuota()}</div>
          </div>
        </section>

        {/* Botones de acción */}
        <section className="form-actions">
          <div className="action-buttons">
            <Button 
              type="submit" 
              variant="primary" 
              size="large" 
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? '⏳ Enviando...' : '📄 Enviar Solicitud'}
            </Button>
          </div>
        </section>
      </form>
    </div>
  );
};

export default CreditApplicationPage;
