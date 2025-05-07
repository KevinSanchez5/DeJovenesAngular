import { Component } from '@angular/core';

@Component({
  selector: 'app-panaderia',
  imports: [],
  templateUrl: './panaderia.component.html',
  styleUrl: './panaderia.component.css'
})
export class PanaderiaComponent {
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

  precioSeleccionado: number | null = null;

  recibirPrecioPan(event: Event): void {
    const selectedNombre = (event.target as HTMLSelectElement).value;
    const selectedPan = this.panes.find(pan => pan.nombre === selectedNombre);
    this.precioSeleccionado = selectedPan ? selectedPan.precio : null;
  }
}
