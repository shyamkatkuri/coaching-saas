export interface TenantSettings {
    id: string;

    organizationId: string;

    dateFormat: string;
    timeFormat: string;
    weekStartDay: string;

    academicYearStartMonth: number;

    invoicePrefix: string | null;
    invoiceNextNumber: number;

    receiptPrefix: string | null;
    receiptNextNumber: number;

    createdAt: Date;
    updatedAt: Date;
}