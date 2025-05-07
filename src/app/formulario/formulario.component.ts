import { Component } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators, FormBuilder, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-formulario',
  imports: [FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})
export class FormularioComponent {

  formularioDeJovenes: FormGroup;

  constructor(private fb: FormBuilder){
    this.formularioDeJovenes = this.fb.group({
      nombre: ['',  [Validators.required, Validators.minLength(2), Validators.maxLength(60)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      dni: ['', [Validators.required, this.validarDni]],
      email: ['', [Validators.required, Validators.email]],
      telefono: ['' , [Validators.required, Validators.pattern(/^[679][0-9]{8}$/)]],
      fecha: ['', [Validators.required, this.validarFecha]],
      codigoP:['', [Validators.required, this.validarCodigoP.bind(this)]],
      provincia: [{ value :'', disabled: true}],
      situacion: ['', Validators.required],
      condiciones: [false, Validators.requiredTrue],
      sexo: [null, Validators.required],
      fichero: [null, [this.validarArchivo]],
      intereses:[[], Validators.required]
    });

  }

  cp_provincias : Record<number, string> = {
    1: "Álava", 2: "Albacete", 3: "Alicante", 4: "Almería", 5: "Ávila",
    6: "Badajoz", 7: "Baleares", 8: "Barcelona", 9: "Burgos", 10: "Cáceres",
    11: "Cádiz", 12: "Castellón", 13: "Ciudad Real", 14: "Córdoba", 15: "Coruña",
    16: "Cuenca", 17: "Gerona", 18: "Granada", 19: "Guadalajara", 20: "Guipúzcoa",
    21: "Huelva", 22: "Huesca", 23: "Jaén", 24: "León", 25: "Lérida",
    26: "La Rioja", 27: "Lugo", 28: "Madrid", 29: "Málaga", 30: "Murcia",
    31: "Navarra", 32: "Orense", 33: "Asturias", 34: "Palencia", 35: "Las Palmas",
    36: "Pontevedra", 37: "Salamanca", 38: "Santa Cruz de Tenerife", 39: "Cantabria", 40: "Segovia",
    41: "Sevilla", 42: "Soria", 43: "Tarragona", 44: "Teruel", 45: "Toledo",
    46: "Valencia", 47: "Valladolid", 48: "Vizcaya", 49: "Zamora", 50: "Zaragoza",
    51: "Ceuta", 52: "Melilla"
  };



  mostrarDatos() {
    if (this.formularioDeJovenes.valid) {
      const datos = this.formularioDeJovenes.value;
  
      const mensaje = `
        Nombre: ${datos.nombre}
        Apellido: ${datos.apellido}
        DNI: ${datos.dni}
        Email: ${datos.email}
        Teléfono: ${datos.telefono}
        Fecha de nacimiento: ${datos.fecha}
        Sexo: ${datos.sexo}
        Intereses: ${datos.intereses.join(', ')}
        Código Postal: ${datos.codigoP}
        Provincia: ${datos.provincia}
        Situación actual: ${datos.situacion}
        DNI Subido: ${datos.fichero?.name }
      `;
  
      alert(mensaje);
    } else {
      this.formularioDeJovenes.markAllAsTouched(); 
    }
  }

  resetearFormulario() {
    this.formularioDeJovenes.reset();
    this.formularioDeJovenes.get('provincia')?.disable;
  }

  validarDni(control: AbstractControl): ValidationErrors | null{
    const value = (control.value || '').toUpperCase();
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const letrasDni: string = "TRWAGMYFPDXBNJZSQVHLCKE"; 

    if (!dniRegex.test(value)) return { dniInvalido: true };

    const numero = parseInt(value.substring(0, 8), 10);
    const letra = value.charAt(8);
    const letraCorrecta = letrasDni[numero % 23];

    return letra === letraCorrecta ? null : { letraIncorrecta: true };
  }

  validarFecha(control: AbstractControl): ValidationErrors | null {
    const valor = control.value;
    const fechaRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/(\d{4})$/;
  
    if (!fechaRegex.test(valor)) {
      return { fechaInvalida: true };
    }
    const partes = valor.split('/');
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; 
    const anyo = parseInt(partes[2], 10);
  
    const fechaIngresada = new Date(anyo, mes, dia);
  
    if (
      fechaIngresada.getDate() !== dia ||
      fechaIngresada.getMonth() !== mes ||
      fechaIngresada.getFullYear() !== anyo
    ) {
      return { fechaInvalida: true };
    }
  
    const hoy = new Date();
    if (fechaIngresada > hoy) {
      return { fechaFutura: true };
    }
    return null; 
  }
  
  validarCodigoP(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value || typeof value !== 'string') return { codigoPostalInvalido: true };

    const codigo = value.trim();
    if (codigo.length !== 5 || !/^\d{5}$/.test(codigo)) {
      return { codigoPostalInvalido: true };
    }

    const provinciaCodigo = parseInt(codigo.substring(0, 2), 10);

    if (provinciaCodigo > 0 && provinciaCodigo <= 52) {
      const provinciaNombre = this.cp_provincias[provinciaCodigo];

      if (control.parent && provinciaNombre) {
        control.parent.get('provincia')?.setValue(provinciaNombre, { emitEvent: false });
      }

      return null;
    }

    return { codigoPostalInvalido: true };
  }


  validarIntereses(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!Array.isArray(value) || value.length === 0) {
      return { interesesVacios: true };
    }
    return null;
  }
  
  validarArchivo(control: AbstractControl): ValidationErrors | null {
    const archivo = control.value;
    if (!archivo) return { archivoRequerido: true };
  
    const extensionesPermitidas = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
    if (archivo instanceof File && !extensionesPermitidas.includes(archivo.type)) {
      return { tipoInvalido: true };
    }
  
    return null;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.formularioDeJovenes.patchValue({ fichero: file });
      this.formularioDeJovenes.get('fichero')?.markAsTouched();
    }
  }



}
