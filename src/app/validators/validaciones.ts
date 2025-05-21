import { AbstractControl, ValidationErrors } from '@angular/forms';



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

  static validarCodigoP(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value || typeof value !== 'string') return { codigoPostalInvalido: true };

    const codigo = value.trim();
    if (codigo.length !== 5 || !/^\d{5}$/.test(codigo)) {
      return { codigoPostalInvalido: true };
    }

    const provinciaCodigo = parseInt(codigo.substring(0, 2), 10);

    if (provinciaCodigo > 0 && provinciaCodigo <= 52) {
      const provinciaNombre = this.cp_provincias[provinciaCodigo];

      return null;
    }

    return { codigoPostalInvalido: true };
  }

   private static esDniValido(value: string): boolean {
    const dniRegex = /^[0-9]{8}[A-Z]$/;
    const letrasDni: string = "TRWAGMYFPDXBNJZSQVHLCKE"; 

    if (!dniRegex.test(value)) return false;

    const numero = parseInt(value.substring(0, 8), 10);
    const letra = value.charAt(8);
    const letraCorrecta = letrasDni[numero % 23];

    return letra === letraCorrecta;
  }

  static validarDni(control: AbstractControl): ValidationErrors | null {
    return this.esDniValido((control.value || '').toUpperCase())
      ? null
      : { dniInvalido: true };
  }

  private static esCifValido(value: string): boolean {
    const cif = value.toUpperCase();
    const cifRegex = /^[ABCDEFGHJKLMNPQRSUVW][0-9]{7}[0-9A-J]$/;
    if (!cifRegex.test(cif)) return false;

    const letras = 'JABCDEFGHI';
    const controlDigit = cif[cif.length - 1];
    const numbers = cif.substring(1, 8);
    let sumEven = 0;
    let sumOdd = 0;

    for (let i = 0; i < numbers.length; i++) {
      const n = parseInt(numbers[i], 10);
      if ((i + 1) % 2 === 0) {
        sumEven += n;
      } else {
        let double = n * 2;
        sumOdd += double > 9 ? Math.floor(double / 10) + (double % 10) : double;
      }
    }

    const totalSum = sumEven + sumOdd;
    const controlDigitCalculated = (10 - (totalSum % 10)) % 10;
    const expectedLetter = letras[controlDigitCalculated];

    const firstChar = cif[0];
    if ('ABEH'.includes(firstChar)) {
      return controlDigit == String(controlDigitCalculated);
    } else if ('KPQS'.includes(firstChar)) {
      return controlDigit === expectedLetter;
    } else {
      return controlDigit === expectedLetter || controlDigit == String(controlDigitCalculated);
    }
  }

  static validarCif(control: AbstractControl): ValidationErrors | null {
    return this.esCifValido((control.value || '').toUpperCase())
      ? null
      : { cifInvalido: true };
  }

  static validarDniOCif(control: AbstractControl): ValidationErrors | null {
    const value = (control.value || '').toUpperCase();

    if (this.esDniValido(value) || this.esCifValido(value)) {
      return null;
    }

    return { documentoInvalido: true };
  }

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

}

