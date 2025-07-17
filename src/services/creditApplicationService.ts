/**
 * API Service para manejo de solicitudes de crédito
 */

export interface ApiResponse {
  success: boolean;
  message: string;
  timestamp?: string;
  id_referencia?: string;
  data?: any;
}

export interface CreditApplicationRequest {
  nit: number;
  valor_solicitado: number;
  plazo: number;
  tasa: number;
  linea: string;
  valor_cobros: number;
  pagaduria: number;
  codeudor1: number;
  codeudor2: number;
  valor_cuota: number;
  completo: string;
  aprobado: string;
  detalle: string;
  devengado: number;
  deducido: number;
  fecha: string;
  impreso: string;
  fecha_primer_pago: string;
  forma_pago: number;
  frecuencia: number;
  usuario: string;
  terminal: string;
  cod_clase_garantia: number;
  valor: number;
  descripcion_garantia: string;
  encargado_evaluar_garantia: string;
  tipo_sistema_amortizacion: number;
  cod_destino_credito: number;
  modalidad_cuota: string;
  numero_poliza: string;
  tasa_seguro: number;
  cuota_administracion: number;
}

class CreditApplicationService {
  private readonly baseUrl: string;
  private readonly endpoint = '/solicitud-credito';

  constructor() {
    // Leer URL del backend desde variable de entorno o usar valor por defecto
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  }

  /**
   * Envía una solicitud de crédito al backend
   */
  async submitCreditApplication(data: CreditApplicationRequest): Promise<ApiResponse> {
    console.log("Enviando datos al backend:", data);
    
    try {
      const response = await fetch(`${this.baseUrl}${this.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      });

      // Obtener respuesta JSON del backend
      const result = await response.json();
      
      // Si el response no es ok (status 4xx o 5xx), pero tenemos JSON válido
      if (!response.ok) {
        console.error(`Error HTTP ${response.status}:`, result);
        return {
          success: false,
          message: result.message || `Error HTTP: ${response.status} - ${response.statusText}`,
          timestamp: result.timestamp
        };
      }

      // Respuesta exitosa
      console.log('Respuesta exitosa del backend:', result);
      return {
        success: result.success || true,
        message: result.message || 'Solicitud procesada exitosamente',
        timestamp: result.timestamp,
        id_referencia: result.id_referencia,
        data: result.data
      };

    } catch (error) {
      console.error('Error de red o parsing:', error);
      
      // Error de red, parsing JSON, etc.
      return {
        success: false,
        message: error instanceof Error ? 
          `Error de conexión: ${error.message}` : 
          'Error desconocido al conectar con el servidor',
      };
    }
  }

  /**
   * Validar los datos antes de enviar
   */
  validateCreditData(data: CreditApplicationRequest): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validaciones básicas
    if (!data.nit || data.nit <= 0) {
      errors.push('NIT es requerido y debe ser mayor a 0');
    }

    if (!data.valor_solicitado || data.valor_solicitado <= 0) {
      errors.push('Valor solicitado es requerido y debe ser mayor a 0');
    }

    if (!data.plazo || data.plazo <= 0) {
      errors.push('Plazo es requerido y debe ser mayor a 0');
    }

    if (!data.tasa || data.tasa <= 0) {
      errors.push('Tasa es requerida y debe ser mayor a 0');
    }

    if (!data.usuario || data.usuario.trim() === '') {
      errors.push('Usuario es requerido');
    }

    if (!data.terminal || data.terminal.trim() === '') {
      errors.push('Terminal es requerido');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Instancia singleton del servicio
export const creditApplicationService = new CreditApplicationService();
