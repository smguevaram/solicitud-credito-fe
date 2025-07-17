/**
 * Common TypeScript interfaces and types for the Aqueron application
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type Theme = 'light' | 'dark' | 'system';

export interface AppConfig {
  apiUrl: string;
  appVersion: string;
  environment: 'development' | 'staging' | 'production';
}

// Interface para el backend - campos exactos con tipos correctos
export interface BackendCreditData {
  // Campos principales requeridos por el backend
  nit: string;                    // char(20)
  valorSolicitado: number;        // money
  plazo: number;                  // int
  tasa: number;                   // money
  linea: string;                  // char(3)
  valorCobros: number;            // money
  pagaduria: string;              // char(20)
  codeudor1?: string;             // char(20), opcional
  codeudor2?: string;             // char(20), opcional
  valorCuota: number;             // money
  completo: boolean;              // bit
  aprobado: boolean;              // bit
  detalle: string;                // char(254)
  devengado: number;              // money
  deducido: number;               // money
  fecha: string;                  // datetime (ISO string)
  impreso: boolean;               // bit
  fechaPrimerPago: string;        // datetime (ISO string)
  formaPago: string;              // char(20)
  frecuencia: string;             // char(20)
  usuario: string;                // char(10)
  terminal: string;               // char(15)
  
  // Garantías
  codClaseGarantia: string;       // char(3)
  valor: number;                  // money
  descripcionGarantia: string;    // char(254)
  encargadoEvaluarGarantia: string; // char(20)
  
  // Configuración del crédito
  tipoSistemaAmortizacion: string; // char(3)
  codDestinoCredito: string;      // char(3)
  modalidadCuota: string;         // char(20)
  numeroPoliza: string;           // char(50)
  tasaSeguro: number;             // money
  cuotaAdministracion: number;    // money
}

export interface CreditFormData {
  // Datos del solicitante
  identificacion: string;         // Mapea a nit
  nombre: string;
  numeroSolicitud: string;
  tipoCredito: string;
  
  // Información del crédito
  valorSolicitado: string;        // Se convierte a number
  cupoLinea: string;             // Información adicional, no va al backend directamente
  plazo: string;                 // Se convierte a int
  tasa: string;                  // Se convierte a number
  tasaSeguro: string;            // Se convierte a number
  formaPago: string;             // char(20)
  frecuencia: string;            // char(20)
  fechaPrimerPago: string;       // Se convierte a datetime ISO
  modalidadCuota: string;        // char(20)
  linea: string;                 // char(3) - línea de crédito
  valorCobros: string;           // Se convierte a number (money)
  pagaduria: string;             // char(20)
  
  // Análisis de riesgo - estos datos no van directamente al backend principal
  cifin: {
    fechaActualizacion: string;
    scoring: string;
    probabilidadMora: boolean;     // Cambio a boolean para checkbox
  };
  datacredito: {
    fechaActualizacion: string;
    scoring: string;
    probabilidadMora: boolean;     // Cambio a boolean para checkbox
  };
  comportamientoEntidad: {
    fechaActualizacion: string;
    procesosJuridicos: number;
    scoring: string;
    probabilidadMora: boolean;     // Cambio a boolean para checkbox
  };
  
  // Codeudores - solo IDs van al backend principal
  codeudores: {
    codeudor1: {
      identificacion: string;      // Mapea a codeudor1 (char(20))
      nombre: string;
      telefono: string;
      email: string;
      ingresos: string;
      patrimonio: string;
    };
    codeudor2: {
      identificacion: string;      // Mapea a codeudor2 (char(20))
      nombre: string;
      telefono: string;
      email: string;
      ingresos: string;
      patrimonio: string;
    };
  };
  
  // Garantías
  garantias: {
    codClaseGarantia: string;      // char(3)
    valor: string;                 // Se convierte a number (money)
    descripcionGarantia: string;   // char(254)
    numeroPoliza: string;          // char(50)
    encargadoEvaluarGarantia: string; // char(20)
  };
  
  // Configuración adicional
  tipoSistemaAmortizacion: string; // char(3)
  codDestinoCredito: string;       // char(3)
  cuotaAdministracion: string;     // Se convierte a number (money)
  
  // Campos adicionales requeridos por el backend
  detalle: string;                 // char(254) - descripción del crédito
  usuario: string;                 // char(10) - usuario que crea la solicitud
  terminal: string;                // char(15) - terminal desde donde se crea
}
