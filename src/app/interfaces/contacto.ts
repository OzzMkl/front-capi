export interface contacto {
    idContacto?: number,
    nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    fecha_nacimiento?: number,
    telefonos?: Array<any>,
    emails?: Array<any>,
    direcciones?: Array<any>,
    //extras
    nombreCompleto?:string
}