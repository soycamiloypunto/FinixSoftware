// archivo: app/features/egreso/models/egreso.model.ts

export interface EgresoModel {
  id?: number;
  fecha: string;
  monto: number;
  concepto: string;
  nombreBeneficiario: string;
  tipoIdentificacion?: string;
  numeroIdentificacion?: string;
  telefonoBeneficiario?: string;
}