/**
 * Utility functions for the Aqueron application
 */

/**
 * Formats a date string to a human-readable format
 * @param date - Date to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (date: Date | string, locale: string = 'en-US'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Debounce function to limit the rate of function execution
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export const capitalize = (str: string): string => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Generates a random ID string
 * @param length - Length of the ID (default: 8)
 * @returns Random ID string
 */
export const generateId = (length: number = 8): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Formats a number as Colombian currency
 * @param amount - Amount to format
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number | string): string => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : amount;
  return numAmount.toLocaleString('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

/**
 * Validates Colombian ID (Cédula)
 * @param id - ID to validate
 * @returns True if valid
 */
export const validateColombianId = (id: string): boolean => {
  if (!id || id.length < 6 || id.length > 10) return false;
  return /^\d+$/.test(id);
};

/**
 * Calculates monthly payment for a loan
 * @param principal - Loan amount
 * @param rate - Annual interest rate (as percentage)
 * @param term - Term in months
 * @returns Monthly payment amount
 */
export const calculateLoanPayment = (principal: number, rate: number, term: number): number => {
  if (rate === 0) return principal / term;
  
  const monthlyRate = rate / 100 / 12;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1);
  
  return Math.round(payment);
};

/**
 * Validates and converts backend data to ensure correct types
 * @param data - Backend credit data to validate
 * @returns Validated data with correct types
 */
export const validateBackendData = (data: any): any => {
  return {
    // Parámetros exactos del backend con tipos validados
    Nit: String(data.nit || '').substring(0, 20),                     // char(20) -> decimal
    Valor_Solicitado: Number(data.valorSolicitado) || 0,              // money
    Plazo: parseInt(String(data.plazo)) || 0,                         // int
    Tasa: Number(data.tasa) || 0,                                     // decimal
    Linea: String(data.linea || '').substring(0, 3),                  // char(3)
    Valor_Cobros: Number(data.valorCobros) || 0,                      // money
    Pagaduria: String(data.pagaduria || '').substring(0, 20),         // smallint -> char(20)
    Codeudor1: data.codeudor1 ? String(data.codeudor1).substring(0, 20) : null, // decimal -> char(20), opcional
    Codeudor2: data.codeudor2 ? String(data.codeudor2).substring(0, 20) : null, // decimal -> char(20), opcional
    Valor_Cuota: Number(data.valorCuota) || 0,                        // money
    Completo: data.completo ? 'S' : 'N',                              // char -> 'S'/'N'
    Aprobado: data.aprobado ? 'S' : 'N',                              // char -> 'S'/'N'
    Detalle: String(data.detalle || '').substring(0, 254),            // char(254)
    Devengado: Number(data.devengado) || 0,                           // money
    Deducido: Number(data.deducido) || 0,                             // money
    Fecha: data.fecha || new Date().toISOString(),                    // datetime
    Impreso: data.impreso ? 'S' : 'N',                                // char -> 'S'/'N'
    Fecha_Primer_Pago: data.fechaPrimerPago || new Date().toISOString(), // datetime
    Forma_pago: mapFormaPago(data.formaPago),                         // int
    Frecuencia: mapFrecuencia(data.frecuencia),                       // int
    usuario: String(data.usuario || '').substring(0, 10),             // char(10)
    terminal: String(data.terminal || '').substring(0, 15),           // char(15)
    Cod_Clase_Garantia: mapClaseGarantia(data.codClaseGarantia),      // int
    Valor: Number(data.valor) || 0,                                   // money
    Descripcion_Garantia: String(data.descripcionGarantia || '').substring(0, 254), // char(254)
    Encargado_Evaluar_Garantia: String(data.encargadoEvaluarGarantia || '').substring(0, 20), // char(20)
    Tipo_Sistema_Amortizacion: mapSistemaAmortizacion(data.tipoSistemaAmortizacion), // int
    Cod_Destino_Credito: mapDestinoCredito(data.codDestinoCredito),   // int
    Modalidad_Cuota: String(data.modalidadCuota || '').substring(0, 20), // char(20)
    Numero_Poliza: String(data.numeroPoliza || '').substring(0, 50),  // char(50)
    Tasa_Seguro: Number(data.tasaSeguro) || 0,                        // decimal
    Cuota_Administracion: Number(data.cuotaAdministracion) || 0,      // money
  };
};

/**
 * Maps form payment type to backend integer
 */
const mapFormaPago = (formaPago: string): number => {
  const mapping: { [key: string]: number } = {
    'Nomina': 1,
    'Caja': 2,
    'Transferencia': 3,
  };
  return mapping[formaPago] || 1;
};

/**
 * Maps frequency to backend integer
 */
const mapFrecuencia = (frecuencia: string): number => {
  const mapping: { [key: string]: number } = {
    'Mensual': 1,
    'Quincenal': 2,
    'Semanal': 3,
  };
  return mapping[frecuencia] || 1;
};

/**
 * Maps guarantee class to backend integer
 */
const mapClaseGarantia = (codClase: string): number => {
  const mapping: { [key: string]: number } = {
    'HIP': 1,  // Hipotecaria
    'PRE': 2,  // Prendaria
    'FID': 3,  // Fiduciaria
    'PER': 4,  // Personal
    '001': 1,
  };
  return mapping[codClase] || 1;
};

/**
 * Maps amortization system to backend integer
 */
const mapSistemaAmortizacion = (sistema: string): number => {
  const mapping: { [key: string]: number } = {
    'FRANCES': 1,
    'ALEMAN': 2,
    'AMERICANO': 3,
    'FRA': 1,
  };
  return mapping[sistema] || 1;
};

/**
 * Maps credit destination to backend integer
 */
const mapDestinoCredito = (destino: string): number => {
  const mapping: { [key: string]: number } = {
    '001': 1,
    '002': 2,
    '003': 3,
  };
  return mapping[destino] || 1;
};
