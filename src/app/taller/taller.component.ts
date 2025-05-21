import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Validaciones } from '../validators/validaciones';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-taller',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './taller.component.html',
  styleUrl: './taller.component.css'
})
export class TallerComponent implements OnInit{

  tablaVisible : boolean = false;


  formularioTaller: FormGroup;

  constructor(private fb: FormBuilder){
    this.formularioTaller = this.fb.group({
      NumeroFactura: ['', [Validators.required, Validators.pattern(/^[0-9]{1,5}$/)]],
      Fecha:['', [Validaciones.validarFecha, Validators.required]],
      NombreCliente:['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
      CodigoPostal: ['', [Validators.required, Validaciones.validarCodigoP]],
      Provincia: [{value: '', disabled:true}],
      Ciudad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      DocumentoId: ['', [Validators.required, Validaciones.validarNIF_CIF]],
      Telefono: ['', [Validators.required, Validators.pattern(/^[679][0-9]{8}$/)]],
      Email: ['', [Validators.required, Validators.email]], 
      pedidos: this.fb.array([])
    })
  }

  compraTotal : string = '0.00 €';
  totalBase21: number = 0;
  totalIVA21: number = 0;
  totalBase10: number = 0;
  totalIVA10: number = 0;
  totalBase4: number = 0;
  totalIVA4: number = 0;
  importeTotalFinal: number = 0;

  get pedidosFormArray(): FormArray {
    return this.formularioTaller.get('pedidos') as FormArray;
  }


  ngOnInit() : void{
    this.formularioTaller.get('CodigoPostal')?.valueChanges.subscribe(value =>{
      const provinciaCodigo = parseInt(value?.substring(0,2),10);
      const nombreProvincia = Validaciones.cp_provincias[provinciaCodigo];
      if (nombreProvincia) {
        this.formularioTaller.get('Provincia')?.setValue(nombreProvincia);
      } else {
        this.formularioTaller.get('Provincia')?.setValue('');
      }
    });
     this.pedidosFormArray.valueChanges.subscribe(() => {
        this.calcularTotalesIva();
        this.calcularCompraTotal();
    });
  }

  mostrarTabla(): void{
    this.tablaVisible = true;
  }

   agregarFila(): void {
    if (this.pedidosFormArray.length > 0) {
      const ultimaFila = this.pedidosFormArray.at(this.pedidosFormArray.length - 1) as FormGroup;
      if (ultimaFila.invalid) {
        alert("Por favor, completa correctamente la última línea antes de añadir otra.");
        ultimaFila.markAllAsTouched();
        return;
      }
    }

    const nuevoPedido = this.fb.group({
      nombre: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]],
      precioPorUnidad: [1, [Validators.required, Validators.min(0.01)]],
      porcentajeIva: [0.21, Validators.required],
      precioSinIva: [{value : 0 , disabled : true}],
      importeIva:[{value : 0 , disabled : true}],
      importeTotal: [{value : 0 , disabled : true}]
    });

    this.pedidosFormArray.push(nuevoPedido);
    this.actualizarLineaProducto(this.pedidosFormArray.length - 1);
  }
 

  actualizarLineaProducto(index: number): void {
    const pedidoControl = this.pedidosFormArray.at(index) as FormGroup;
    const pedido = pedidoControl.getRawValue();

    const cantidad = Number(pedido.cantidad);
    const precioPorUnidad = Number(pedido.precioPorUnidad);
    const porcentajeIva = Number(pedido.porcentajeIva);

    if (pedido.nombre && !isNaN(cantidad) && cantidad >= 0 && !isNaN(precioPorUnidad) && precioPorUnidad >= 0) {
      const precioSinIvaCalculado = cantidad * precioPorUnidad;
      const importeIvaCalculado = precioSinIvaCalculado * porcentajeIva;
      const importeTotalCalculado = precioSinIvaCalculado + importeIvaCalculado;

      pedidoControl.patchValue({
        precioSinIva: parseFloat(precioSinIvaCalculado.toFixed(2)),
        importeIva: parseFloat(importeIvaCalculado.toFixed(2)),
        importeTotal: parseFloat(importeTotalCalculado.toFixed(2))
      }, { emitEvent: false });
    } else {
      pedidoControl.patchValue({
        precioSinIva: 0,
        importeIva: 0,
        importeTotal: 0
      }, { emitEvent: false });
    }
    this.calcularTotalesIva();
    this.calcularCompraTotal();
  }


  eliminarLinea(index: number): void {
    this.pedidosFormArray.removeAt(index);
  }

 calcularCompraTotal(): void {
    let precioTotal: number = 0;
    this.pedidosFormArray.getRawValue().forEach((pedido: any) => { 
      if (pedido.importeTotal !== undefined && !isNaN(pedido.importeTotal)) {
        precioTotal += pedido.importeTotal;
      }
    });
    this.compraTotal = precioTotal.toFixed(2).toString() + "€";
    this.importeTotalFinal = parseFloat(precioTotal.toFixed(2)); 
  }

  calcularTotalesIva(): void {
    this.totalBase21 = 0;
    this.totalIVA21 = 0;
    this.totalBase10 = 0;
    this.totalIVA10 = 0;
    this.totalBase4 = 0;
    this.totalIVA4 = 0;

    this.pedidosFormArray.getRawValue().forEach((pedido: any) => { 
      const iva = Number(pedido.porcentajeIva);
      const base = Number(pedido.precioSinIva);
      const tasa = Number(pedido.importeIva);

      if (!isNaN(base) && !isNaN(tasa)) {
        if (iva === 0.21) {
          this.totalBase21 += base;
          this.totalIVA21 += tasa;
        } else if (iva === 0.1) {
          this.totalBase10 += base;
          this.totalIVA10 += tasa;
        } else if (iva === 0.04) {
          this.totalBase4 += base;
          this.totalIVA4 += tasa;
        }
      }
    });
    this.totalBase21 = parseFloat(this.totalBase21.toFixed(2));
    this.totalIVA21 = parseFloat(this.totalIVA21.toFixed(2));
    this.totalBase10 = parseFloat(this.totalBase10.toFixed(2));
    this.totalIVA10 = parseFloat(this.totalIVA10.toFixed(2));
    this.totalBase4 = parseFloat(this.totalBase4.toFixed(2));
    this.totalIVA4 = parseFloat(this.totalIVA4.toFixed(2));
  }
  generarFactura(): void {
    if (this.formularioTaller.valid && this.pedidosFormArray.valid && this.pedidosFormArray.length > 0) {
      console.log('Formulario válido, generando factura:', this.formularioTaller.getRawValue());

      this.llenarContenidoModal();

      const modalElement = document.getElementById('modalFactura');
      if (modalElement) {
        const modal = new (window as any).bootstrap.Modal(modalElement);
        modal.show();
      } else {
        console.error('El elemento del modal no fue encontrado.');
      }
    } else {
      console.log('Formulario inválido o sin productos, revisa los campos.');
      this.formularioTaller.markAllAsTouched();
      this.pedidosFormArray.controls.forEach(control => control.markAllAsTouched());
      alert("Por favor, completa todos los campos del formulario y añade al menos un producto válido para generar la factura.");
    }
  }

  llenarContenidoModal(): void {
    const datosCliente = this.formularioTaller.getRawValue();
    const productos = this.pedidosFormArray.getRawValue();

    let contenidoHtml = `
      <h5>Datos del Cliente</h5>
      <ul>
        <li><strong>Factura nº:</strong> ${datosCliente.NumeroFactura}</li>
        <li><strong>Fecha:</strong> ${datosCliente.Fecha}</li>
        <li><strong>Nombre:</strong> ${datosCliente.NombreCliente}</li>
        <li><strong>Código Postal:</strong> ${datosCliente.CodigoPostal}</li>
        <li><strong>Provincia:</strong> ${datosCliente.Provincia}</li>
        <li><strong>Ciudad:</strong> ${datosCliente.Ciudad}</li>
        <li><strong>CIF/NIF:</strong> ${datosCliente.DocumentoId}</li>
        <li><strong>Teléfono:</strong> ${datosCliente.Telefono}</li>
        <li><strong>Email:</strong> ${datosCliente.Email}</li>
      </ul>
      <h5 class="mt-4">Productos</h5>
      <table class="table table-striped">
        <thead>
          <tr>
            <th>Número</th>
            <th>Nombre</th>
            <th>Cantidad</th>
            <th>Precio por unidad</th>
            <th>IVA (%)</th>
            <th>Precio sin IVA</th>
            <th>Importe IVA</th>
            <th>Importe Total</th>
          </tr>
        </thead>
        <tbody>
    `;

    productos.forEach((pedido: any, index: number) => {
      contenidoHtml += `
          <tr>
            <td>${index + 1}</td>
            <td>${pedido.nombre}</td>
            <td>${pedido.cantidad}</td>
            <td>${pedido.precioPorUnidad.toFixed(2)} €</td>
            <td>${(pedido.porcentajeIva * 100).toFixed(0)}%</td>
            <td>${pedido.precioSinIva.toFixed(2)} €</td>
            <td>${pedido.importeIva.toFixed(2)} €</td>
            <td>${pedido.importeTotal.toFixed(2)} €</td>
          </tr>
      `;
    });

    contenidoHtml += `
        </tbody>
      </table>

      <h5 class="mt-4">Resumen de Impuestos</h5>
      <ul class="list-unstyled">
          <li><strong>Base IVA 21%:</strong> ${this.totalBase21.toFixed(2)} €</li>
          <li><strong>IVA 21%:</strong> ${this.totalIVA21.toFixed(2)} €</li>
          <li><strong>Base IVA 10%:</strong> ${this.totalBase10.toFixed(2)} €</li>
          <li><strong>IVA 10%:</strong> ${this.totalIVA10.toFixed(2)} €</li>
          <li><strong>Base IVA 4%:</strong> ${this.totalBase4.toFixed(2)} €</li>
          <li><strong>IVA 4%:</strong> ${this.totalIVA4.toFixed(2)} €</li>
      </ul>

      <div class="text-end fw-bold fs-4">
          Total de la Factura: ${this.importeTotalFinal.toFixed(2)} €
      </div>
    `;

    const contenidoModalElement = document.getElementById("contenidoModalFactura");
    if (contenidoModalElement) {
      contenidoModalElement.innerHTML = contenidoHtml;
    }
  }

  captchaValido: boolean = false;

captchaResolved(response: Event) {
  if (response) {
    this.captchaValido = true;
  } else {
    this.captchaValido = false;
  }
}

}
