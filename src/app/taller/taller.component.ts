import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validaciones } from '../validators/validaciones';

@Component({
  selector: 'app-taller',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './taller.component.html',
  styleUrl: './taller.component.css'
})
export class TallerComponent {

  tablaVisible : boolean = false;


  formularioTaller: FormGroup;

  constructor(private fb: FormBuilder){
    this.formularioTaller = this.fb.group({
      NumeroFactura: ['', [Validators.required, Validators.max(99999), Validators.min(1)]],
      Fecha:['', [Validaciones.validarFecha, Validators.required]],
      NombreCliente:['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      CodigoPostal: ['', [Validators.required, Validaciones.validarCodigoP]],
      Provincia: [{value: '', disabled:true}],
      Ciudad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      DocumentoId: ['', [Validators.required, Validaciones.validarDniOCif]],
      Telefono: ['', [Validators.required, Validators.pattern(/^[679][0-9]{8}$/)]],
      Email: ['', [Validators.required, Validators.email]], 
      Captcha:['', [Validators.required]]
    })
  }
}
