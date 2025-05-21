import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';



export class Validaciones {

  static cp_provincias : Record<number, string> = {
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

    static validarCodigoP: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const cp = control.value;
      if (!cp) {
        return null;
      }

      if (!/^\d{5}$/.test(cp)) {
        return { formatoInvalido: true };
      }
      
      const provinciaCodigo = parseInt(cp.substring(0, 2), 10);
      if (!Validaciones.cp_provincias[provinciaCodigo]) {
        return { codigoPostalInvalido: true };
      }

      return null;
    };

  static validarFecha(control: AbstractControl): ValidationErrors | null {
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

  static validarNIF_CIF: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const value = control.value ? control.value.toUpperCase() : '';
    if (!value) {
      return null; 
    }

    const validarNIF = (nif: string): boolean => {
      const letters = 'TRWAGMYFPDXBNJZSQVHLCKE';
      let dni = nif;

      if (nif.length !== 9) return false;

      if (nif.startsWith('X')) dni = '0' + nif.substring(1);
      if (nif.startsWith('Y')) dni = '1' + nif.substring(1);
      if (nif.startsWith('Z')) dni = '2' + nif.substring(1);

      const num = parseInt(dni.substring(0, 8), 10);
      const letter = dni.substring(8, 9);

      if (isNaN(num)) return false; 

      return letters.charAt(num % 23) === letter;
    };

    const validarCIF = (cif: string): boolean => {
      if (cif.length !== 9) return false;

      const controlLetter = cif.charAt(8);
      const firstLetter = cif.charAt(0);
      const numericPart = cif.substring(1, 8);

      if (!/^[0-9]{7}$/.test(numericPart)) return false;

      let sum = 0;
      for (let i = 0; i < 7; i++) {
        let digit = parseInt(numericPart.charAt(i), 10);
        if (i % 2 === 0) { 
          digit *= 2;
          sum += digit < 10 ? digit : (Math.floor(digit / 10) + (digit % 10));
        } else { 
          sum += digit;
        }
      }

      const unitDigit = sum % 10;
      const controlDigit = unitDigit === 0 ? 0 : 10 - unitDigit;

      const controlLetters = 'JABCDEFGHI';

      
      switch (firstLetter) {
        case 'A': case 'B': case 'E': case 'H':
          return (controlLetter === String(controlDigit) || controlLetter === controlLetters.charAt(controlDigit));
        case 'C': case 'K': case 'L': case 'M': 
          return controlLetter === controlLetters.charAt(controlDigit);
        case 'P': case 'Q': case 'S': 
          return controlLetter === controlLetters.charAt(controlDigit);
        case 'D': case 'F': case 'G': case 'J': case 'N': case 'R': case 'V': case 'W': // Persona jurídica (solo número)
          return controlLetter === String(controlDigit);
        default:
          return false;
      }
    };

    if (validarNIF(value)) {
      return null;
    }

    if (validarCIF(value)) {
      return null;
    }

    return { nifCifInvalido: true };
  };
}

