import { Component, OnInit } from '@angular/core';
import { ContactosService } from './services/contactos.service';
import { MenuItem } from 'primeng/api';
import { selectBusqueda } from './interfaces/selectBusqueda';
import { contacto } from './interfaces/contacto';
import { direccion } from './interfaces/direccion';
import { MessageService, ConfirmationService, ConfirmEventType} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [MessageService,ConfirmationService]
})
export class AppComponent implements OnInit {
  contactos: any;
  showActionsList = false;

  public menuItems: MenuItem[] =[];
  public isViewModal: Boolean = false;
  public strModalTitle: string = '';
  optionsSelect: selectBusqueda[] | any;
  selectedOpt: selectBusqueda | any;
  valSearch: string = '';
  contacto: contacto = { 
    nombre:'',
    apellido_paterno:'',
    apellido_materno:'',
    telefonos: [],
    emails: [],
    direcciones: []
  };
  direccion: direccion = {
    idDireccion: undefined,
    idContactoFk: undefined,
    estado: '',
    ciudad: '',
    colonia: '',
    calle: '',
    numero: '',
    codigo_postal: ''
  }
  nuevoTelefono: string = '';
  nuevoEmail: string = '';
  //pagination
  public totalPages: any;
  pageActual: number = 1;

  constructor(
    private _contactosService: ContactosService,
    private messageService: MessageService,
    private _confirmationService: ConfirmationService,){}

  ngOnInit(): void {
    this.add_optMenu();
    this.setOptionsSelect();
    this.getContacts();
  }

  /**
   * @description
   * Agrega las opciones al menu de la tabla principal de contactos
   */
  add_optMenu(){
    this.menuItems = [
      {
          label: 'Opciones',
          items: [
              {
                  label: 'Detalles',
                  icon: 'pi pi-eye',
                  command: () =>{
                    this.open_modal('Detalles');
                  }
              },
              {
                  label: 'Editar',
                  icon: 'pi pi-pen-to-square',
                  command: () =>{
                    this.open_modal('Editar');
                  }
              },
              {
                label: 'Eliminar',
                icon: 'pi pi-trash',
                command: () =>{
                  this.deleteContacto();
                }
            }
          ]
      }
  ];
  }

  /**
 * @description
 * Carga el array a mostrar del dropdown de busqueda
 */
  setOptionsSelect(){
    this.optionsSelect = [
      {id:1, name:'Nombre'},
      {id:2, name:'Telefono'},
      {id:3, name:'Direccion'},
      {id:4, name:'Email'},
    ];

    //Seleccionamos por defecto la primera opcion
    this.selectedOpt = this.optionsSelect[0];
  }

  /**
   * 
   * @param motivo 
   * @description
   * Abre el modal de acuerdo al tipo de accion
   */
  open_modal(motivo:string){
    //Limpiamos modelo
    this.contacto = { 
      nombre:'',
      apellido_paterno:'',
      apellido_materno:'',
      telefonos: [],
      emails: [],
      direcciones: []
    };

    switch(motivo){
      case 'Detalles':
          this.getContact();
          this.isViewModal=true;
          this.strModalTitle = 'Detalles';
        break;
      case 'Agregar':
          this.isViewModal=true;
          this.strModalTitle = 'Agregar';
        break;
      case 'Editar':
          this.getContact();
          this.isViewModal=true;
          this.strModalTitle = 'Editar';
        break;
    }
  }

  /**
  * Busqueda
  */
  onSearch(){
    if(this.selectedOpt){
      if(this.valSearch == "" || null){
        this.getContacts();
      } else{
        switch(this.selectedOpt.id){
          case 1 : //Nombre
            this.getContacts(1,this.selectedOpt.id,this.valSearch);
            break;
          case 2 ://Telefono
            this.getContacts(1,this.selectedOpt.id,this.valSearch);
            break;
          case 3 : //Direcion
            this.getContacts(1,this.selectedOpt.id,this.valSearch);
            break;
          case 4 : //Email
            this.getContacts(1,this.selectedOpt.id,this.valSearch);
            break;
        }
      }
    }
  }

  /**
   * 
   * @param event 
   */
  onPageChange(event:any){
    this.getContacts(event.page + 1);
  }
  
  /**
   * 
   * @param contacto 
   * Selecciona el contacto de la fila al darle click al boton del menu
   */
  selectedContact(contacto:any){
    this.contacto = contacto;
  }

  /**
   * 
   * @param page - Numero de pagina
   * @param type - Tipo de busqueda 1: nombre 2: telefono, 3: direccion, 4: email
   * @param search - Valor a buscar por defecto es 'null'
   * @description
   * Funcion que trae los resultado del index de contactos, estos datos estan paginados
   */
  getContacts(page:number = 1, type:number = 0, search:string = 'null'){
    this._contactosService.getContactos(page,type,search).subscribe(
      response =>{
        if(response.status == 'success' && response.code == 200){
          this.contactos = response.data.data;
          this.totalPages = response.data.total;
          this.pageActual = response.data.current_page;
        }
        // console.log(response)
      }, error =>{
        console.log(error);
      }
    )
  }

  /**
   * @description
   * Trae informacion detallada del contacto
   */
  getContact(){
    if(this.contacto && this.contacto.idContacto){
      this._contactosService.getContacto(this.contacto.idContacto).subscribe(
        (response: any) =>{
          if(response.status == 'success' && response.code == 200){
            this.contacto = response.data;
          }
        }, error =>{
          this.messageService.add({
            severity:'error', 
            summary:'Error', 
            detail: error.message
          });
          console.log(error);
        }
      )
    }
    
  }

  /**
   * 
   * @param motivo 
   * @description
   * Envio del formulario para Agregar y Actualizar
   */
  submit(motivo:string){
    if(this.validateForm(this.contacto) && motivo){
      switch(motivo){
        case 'Agregar':
            this._contactosService.postContacto(this.contacto).subscribe(
              response =>{
                if(response.status == 'success' && response.code == 200){
                  this.getContacts();
                  this.isViewModal = false;
                  this.messageService.add({
                    severity:'success', 
                    summary:'Registro exitoso', 
                    detail: response.message
                  });
                }
              }, error =>{
                this.messageService.add({
                  severity:'error', 
                  summary:'Error', 
                  detail: error.message
                });
                console.log(error);
              }
            )
          break;
        case 'Editar':
            this.updateContacto();
            break;
      }
    }
  }

  /**
   * 
   * @param contacto 
   * @returns boolean
   * @description
   * Validacion del formulario, solo se valida el nombre, apellido paterno y materno
   */
  validateForm(contacto:contacto):boolean{
    let isOk = true
    if(contacto.nombre.length < 3){
      isOk = false;
    }
    if(contacto.apellido_paterno.length < 3){
      isOk = false;
    }
    if(contacto.apellido_materno.length < 3){
      isOk = false;
    }
    return isOk;
  }

  /**
   * 
   * @param arrName - string, es la propiedad a agregar el elemento
   * @description
   * Agregar un elemento a una propiedad del contacto (telefonos, emails o direcciones)
   */
  add_item_toArrayContact(arrName:string){
    switch(arrName){
      case 'telefono':
          if (this.nuevoTelefono) {
            this.contacto.telefonos?.push({ telefono: this.nuevoTelefono });
            this.nuevoTelefono = ''; 
          }
        break;
      case 'email':
          if (this.nuevoEmail) {
            this.contacto.emails?.push({ email: this.nuevoEmail });
            this.nuevoEmail = ''; 
          }
        break;
      case 'direccion':
          if (this.direccion) {
            this.contacto.direcciones?.push({ ...this.direccion });
            this.direccion = {
              idDireccion: undefined,
              idContactoFk: undefined,
              estado: '',
              ciudad: '',
              colonia: '',
              calle: '',
              numero: '',
              codigo_postal: ''
            }
          }
        break;
    }
    
  }

  /**
   * 
   * @param arrName 
   * @param item 
   * @description
   * Elimina un elemento a una propiedad del contacto (telefonos, emails o direcciones)
   */
  delete_item_toArrayContact(arrName:string,item:any){
    switch(arrName){
      case 'telefono':
          //Creamos una nueva lista de acuerdo al valor seleccionado (se omite)
          this.contacto.telefonos = this.contacto.telefonos?.filter(x => x != item);
        break;
      case 'email':
          this.contacto.emails = this.contacto.emails?.filter(x => x != item);
        break;
      case 'direccion':
          this.contacto.direcciones = this.contacto.direcciones?.filter(x => x != item);
        break;
      }
  }

  /**
   * @description
   * Actualizacion del contacto
   */
  updateContacto(){
    if(this.contacto && this.contacto.idContacto){
      this._contactosService.putContacto(this.contacto.idContacto, this.contacto).subscribe(
        response =>{
          if(response.status == 'success' && response.code == 200){
            this.getContacts();
            this.isViewModal = false;
            this.messageService.add({
              severity:'success', 
              summary:'Registro exitoso', 
              detail: response.message
            });
          }
        }, error =>{
          this.messageService.add({
            severity:'error', 
            summary:'Error', 
            detail: error.message
          });
          console.log(error);
        }
      )
    }
  }

  /**
   * @description
   * Eliminacion del contacto, muestra mensaje de confirmacion
   */
  deleteContacto(){
    this._confirmationService.confirm({
      message: '¿Esta seguro(a) de que desea eliminar el contacto?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      accept: () =>{
        if(this.contacto && this.contacto.idContacto){
          this._contactosService.delContacto(this.contacto.idContacto).subscribe(
            response =>{
              if(response.status == 'success' && response.code == 200){
                this.getContacts();
                this.isViewModal = false;
                this.messageService.add({
                  severity:'success', 
                  summary:'Registro exitoso', 
                  detail: response.message
                });
              }
            }, error =>{
              this.messageService.add({
                severity:'error', 
                summary:'Error', 
                detail: error.message
              });
              console.log(error);
            }
          )
        }
      },
      reject: (type:any) => {
        switch(type) {
            case ConfirmEventType.REJECT:
                this.messageService.add({
                    severity:'warn', 
                    summary:'Cancelado', 
                    detail:'Confirmacion cancelada.'
                });
            break;
            case ConfirmEventType.CANCEL:
                this.messageService.add({
                    severity:'warn', 
                    summary:'Cancelado', 
                    detail:'Confirmacion cancelada.'
                });
            break;
        }
      }
    });
  }
}
