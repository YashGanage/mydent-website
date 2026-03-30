import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AppointmentRequest {
    serviceType: string;
    timestamp: Time;
    patientName: string;
    phoneNumber: string;
}
export type Time = bigint;
export interface backendInterface {
    bookAppointment(patientName: string, phoneNumber: string, serviceType: string): Promise<void>;
    getAllRequests(): Promise<Array<AppointmentRequest>>;
}
