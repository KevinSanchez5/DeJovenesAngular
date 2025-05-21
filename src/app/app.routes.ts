import { Routes } from '@angular/router';
import { PanaderiaComponent } from './panaderia/panaderia.component';
import { FormularioComponent } from './formulario/formulario.component';
import { TallerComponent } from './taller/taller.component';

export const routes: Routes = [
    { path: '', component: FormularioComponent},
    { path: 'panaderia', component: PanaderiaComponent },
    { path: 'taller', component: TallerComponent}
];