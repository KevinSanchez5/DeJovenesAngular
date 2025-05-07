import { Routes } from '@angular/router';
import { PanaderiaComponent } from './panaderia/panaderia.component';
import { FormularioComponent } from './formulario/formulario.component';

export const routes: Routes = [
    { path: '', component: FormularioComponent},
    { path: 'panaderia', component: PanaderiaComponent },
];