import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-panaderia',
  imports: [FormsModule],
  templateUrl: './panaderia.component.html',
  styleUrl: './panaderia.component.css'
})
export class PanaderiaComponent {

  tablaVisible: boolean = false;

    panes = [
      { nombre: "", precio: null },
      { nombre: "Baguette", precio: 0.70 },
      { nombre: "Pan integral", precio: 1.75 },
      { nombre: "Croissant", precio: 1.00 },
      { nombre: "Pan de centeno", precio: 1.80 },
      { nombre: "Napolitana de chocolate", precio: 1.00 },
      { nombre: "Pan de molde", precio: 1.50 },
      { nombre: "Rosquilla", precio: 0.95 },
      { nombre: "Ensaimada", precio: 1.80 }
  ];

   productoSeleccionado: string = '';
   precioSeleccionado: number | null = null;
   cantidadSeleccionada: number | null = null;

   compraTotal : string = '0.00 €';

   pedidos: { nombre:string, precio:number, cantidad:number } [] = [];


   ngOnInit(): void {
    const pedidosGuardados = localStorage.getItem('pedidosGuardados');
    if (pedidosGuardados) {
      this.pedidos = JSON.parse(pedidosGuardados);
      this.calcularTotalCompra(); 
      this.tablaVisible = true;
    }
  }

  recibirPrecioPan(event: Event): void {
    const selectedNombre = (event.target as HTMLSelectElement).value;
    this.productoSeleccionado = selectedNombre;
    const selectedPan = this.panes.find(pan => pan.nombre === selectedNombre);
    this.precioSeleccionado = selectedPan ? selectedPan.precio : null;
  }

  mostrarTabla(): void{
    this.tablaVisible = true;
  }

  agregarPedido(): void{
  if(!this.productoSeleccionado || this.precioSeleccionado == null || !this.cantidadSeleccionada || this.cantidadSeleccionada <= 0){
    alert("La cantidad y precio deben ser mayor que 0");
    return;
  } 
  const panEncontrado : any = this.pedidos.find(pan => pan.nombre === this.productoSeleccionado)
  if(panEncontrado){
    panEncontrado.cantidad+= this.cantidadSeleccionada;
    localStorage.clear();
    localStorage.setItem('pedidosGuardados', JSON.stringify(this.pedidos));
  } else {

  this.pedidos.push({
    nombre: this.productoSeleccionado,
    precio: this.precioSeleccionado,
    cantidad: this.cantidadSeleccionada
  });
  }
  this.cantidadSeleccionada = null;
  this.precioSeleccionado = null;
  this.productoSeleccionado ='';
  localStorage.clear();
  localStorage.setItem('pedidosGuardados', JSON.stringify(this.pedidos));
  this.calcularTotalCompra();
  }

  calcularTotalCompra(): void{
    let precioTotal : number = 0;
    this.pedidos.forEach(element => {
      precioTotal += element.precio * element.cantidad;
    });
    this.compraTotal = precioTotal.toFixed(2).toString() + '€'; 
  }

  eliminarFila(index: number ):void{
    this.pedidos.splice(index, 1);
    this.calcularTotalCompra();
    localStorage.clear();
    localStorage.setItem('pedidosGuardados', JSON.stringify(this.pedidos));
  }

  
}
