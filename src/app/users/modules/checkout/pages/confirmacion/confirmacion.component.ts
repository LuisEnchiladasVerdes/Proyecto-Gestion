import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AlertService} from "../../../../../services/alert.service";
import {CartService} from "../../../../../services/cart.service";
import {DetallerCart} from "../../../../../models/detaller-cart.models";
import {VerifyService} from "../../../../../services/verify.service";
import {ToastrService} from "ngx-toastr";
import {NavigationStateService} from "../../../../../services/navigation-state.service";
import {Reserva} from "../../../../../models/Reserva.models";

@Component({
  selector: 'app-confirmacion',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    FormsModule
  ],
  templateUrl: './confirmacion.component.html',
  styleUrl: './confirmacion.component.css'
})
export class ConfirmacionComponent implements OnInit {
  formulario: FormGroup;
  botonDeshabilitado = true;
  mostrarModal = false; // Controla la visibilidad del modal
  codigo: string = ''; // Almacena el código ingresado

  verificationToken: string | null = null; // Almacenará el token de verificación

  cartProducts: DetallerCart[] = []; // Reemplaza los datos estáticos por un arreglo vacío
  total: number = 0;

  numero_telefono: number = 0;

  fechaActual = new Date().toISOString().split('T')[0];
  fecahHoy = new Date();
  fechaMaxima = new Date(this.fecahHoy.getTime() + 2 * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  intentosRestantes = 3; // Número máximo de intentos permitidos

  constructor(private fb: FormBuilder, private router: Router, private alertService: AlertService, private cartService: CartService, private verify: VerifyService, private toastr: ToastrService, private navigationStateService: NavigationStateService) {
    this.formulario = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      // nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      nombre: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/)]],
      // apellido: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)]],
      correo: ['', [Validators.required, Validators.email]],
      calle: ['', [Validators.required]],
      colonia: ['', [Validators.required]],
      codigo_postal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      numero_exterior: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      numero_interior: [''],
      referencia: ['', [Validators.required]],
      metodo_pago: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadCart(); // Carga los productos del carrito al iniciar
  }

  loadCart(): void {
    this.cartService.getCurrentCart().subscribe({
      next: (cart) => {
        this.cartProducts = cart.detalles; // Carga los detalles reales del carrito
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    });
  }

  calculateTotal(): number {
    return this.cartProducts.reduce((sum, product) => sum + product.cantidad * product.producto.precio_actual, 0);
  }

  sendVerificationCode(): void {
    const phoneNumber = this.formulario.get('numero')?.value; // Obtener el número del formulario
    this.numero_telefono = this.formulario.get('numero')?.value;
    if (!phoneNumber) {
      this.alertService.error('Por favor, ingresa un número válido.');
      return;
    }

    this.verify.sendVerificationCode(phoneNumber).subscribe({
      next: (response) => {
        this.alertService.success('¡Código enviado correctamente!');
        // console.log('Respuesta del servidor:', response);
        this.abrirModal()
      },
      error: (error) => {
        console.error('Error al enviar el código:', error);
        this.alertService.error('Hubo un error al enviar el código. Intenta de nuevo.');
      },
    });
  }

  abrirModal() {
    this.mostrarModal = true;
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.codigo = ''; // Limpia el código al cerrar
  }

  validarCodigo1(): void {
    // Verifica que el código tenga exactamente 6 dígitos
    if (!/^\d{6}$/.test(this.codigo)) {
      this.alertService.error('El código debe tener exactamente 6 dígitos.');
      return;
    }

    const phoneNumber = this.formulario.get('numero')?.value; // Obtiene el número de teléfono del formulario
    if (!phoneNumber) {
      this.alertService.error('No se encontró el número de teléfono. Valídalo primero.');
      return;
    }

    const payload = {
      phone_number: `+52${phoneNumber}`, // Agregamos la lada +52
      code: this.codigo, // Código ingresado en el modal
    };

    this.verify.verifyCode((this.numero_telefono).toString(), this.codigo).subscribe({
      next: (response) => {
        if (response.message === 'Código de verificación correcto. Cliente verificado.') {
          this.alertService.success('¡Código verificado exitosamente! Cliente verificado.');

          // Llenamos el formulario con los datos del cliente
          const cliente = response.cliente;
          if (cliente) {
            this.formulario.patchValue({
              nombre: cliente.nombre,
              // apellido: cliente.apellido || '', // Ajusta según la estructura del backend
              correo: cliente.correo,
              calle: cliente.direcciones?.[0]?.calle || '',
              colonia: cliente.direcciones?.[0]?.colonia || '',
              codigo_postal: cliente.direcciones?.[0]?.codigo_postal || '',
              numero_exterior: cliente.direcciones?.[0]?.numero_casa || '',
              referencia: cliente.direcciones?.[0]?.nombre_direccion || '',
            });
            this.formulario.get('nombre')?.disable();
            this.formulario.get('correo')?.disable();
          }
        } else if (response.message === 'Código de verificación correcto. Cliente no registrado.') {
          this.alertService.success('¡Código verificado exitosamente! Cliente no registrado.');
        }

        // En ambos casos de éxito (cliente verificado o no registrado), cerramos el modal
        this.cerrarModal();
        this.botonDeshabilitado = false;
        this.formulario.get('numero')?.disable();
        this.intentosRestantes = 3; // Reinicia los intentos si el código es correcto
        // this.formulario.get('nombre')?.disable();
        // this.formulario.get('correo')?.disable();
      },
      error: () => {
        this.intentosRestantes -= 1; // Reducir un intento en caso de error
        if (this.intentosRestantes > 0) {
          this.alertService.error(
            `Código incorrecto. Intentos restantes: ${this.intentosRestantes}`
          );
        } else {
          this.alertService.error(
            'Has agotado todos los intentos. Envia de nuevo el codigo.'
          );
          this.cerrarModal(); // Cierra el modal si se agotaron los intentos
          this.intentosRestantes = 3; // Reinicia los intentos para el siguiente uso
        }
      },
    });
  }

  validarCodigo(): void {
    // Verifica que el código tenga exactamente 6 dígitos
    if (!/^\d{6}$/.test(this.codigo)) {
      this.alertService.error('El código debe tener exactamente 6 dígitos.');
      return;
    }

    const phoneNumber = this.formulario.get('numero')?.value; // Obtiene el número de teléfono del formulario
    if (!phoneNumber) {
      this.alertService.error('No se encontró el número de teléfono. Valídalo primero.');
      return;
    }

    this.verify.verifyCode(phoneNumber, this.codigo).subscribe({
      next: (response) => {
        if (response.message === 'Código de verificación correcto. Cliente verificado o creado.') {
          this.alertService.success('¡Código verificado exitosamente!');

          // Almacena el `verification_token` para usarlo más tarde
          this.verificationToken = response.verification_token;
          // console.log('Token', this.verificationToken);

          // Rellenar formulario con datos del cliente, si existen
          const cliente = response.cliente;
          if (cliente) {
            this.formulario.patchValue({
              nombre: cliente.nombre,
              // apellido: cliente.apellido || '', // Ajusta según la estructura del backend
              correo: cliente.correo,
              calle: cliente.direcciones?.[0]?.calle || '',
              colonia: cliente.direcciones?.[0]?.colonia || '',
              codigo_postal: cliente.direcciones?.[0]?.codigo_postal || '',
              numero_exterior: cliente.direcciones?.[0]?.numero_casa || '',
              referencia: cliente.direcciones?.[0]?.nombre_direccion || '',
            });
            this.formulario.get('nombre')?.disable();
            this.formulario.get('correo')?.disable();
          }
        } else if (response.message === 'Código de verificación correcto. Cliente no registrado.') {
          this.alertService.success('¡Código verificado exitosamente! Cliente no registrado.');
          this.formulario.get('nombre')?.enable();
          this.formulario.get('correo')?.enable();
        }

        // En ambos casos de éxito (cliente verificado o no registrado), cerramos el modal
        this.cerrarModal();
        this.botonDeshabilitado = false;
        this.formulario.get('numero')?.disable();
        this.intentosRestantes = 3; // Reinicia los intentos si el código es correcto
      },
      error: () => {
        this.intentosRestantes -= 1;
        if (this.intentosRestantes > 0) {
          this.alertService.error(`Código incorrecto. Intentos restantes: ${this.intentosRestantes}`);
        } else {
          this.alertService.error('Has agotado todos los intentos. Envia de nuevo el código.');
          this.cerrarModal();
          this.intentosRestantes = 3; // Reinicia los intentos
        }
      },
    });
  }


  submitForm() {
    if (this.formulario.valid) {
      // console.log('Formulario válido:', this.formulario.value);
      // this.finalizeOrder();
      this.crearReserva();
    } else {
      this.alertService.error('Por favor, completa todos los campos obligatorios.');
    }
  }

  finalizeOrder(): void {
    this.navigationStateService.setAccessRealizado(true); // Habilitar acceso a "Realizado"
    this.router.navigate(['/carrito/realizado']);
  }



  crearReserva(): void {
    // Verificar que el token exista
    if (!this.verificationToken) {
      this.alertService.error('No se encontró el token de verificación. Por favor, valida tu número nuevamente.');
      return;
    }

    // Construir el objeto de reserva desde el formulario
    const reserva: Reserva = {
      cliente: {
        telefono: `+52${this.formulario.get('numero')?.value}`,
        nombre: this.formulario.get('nombre')?.value,
        correo: this.formulario.get('correo')?.value
      },
      direccion: {
        nombre_direccion: this.formulario.get('referencia')?.value || null,
        calle: this.formulario.get('calle')?.value,
        numero_casa: this.formulario.get('numero_exterior')?.value,
        colonia: this.formulario.get('colonia')?.value,
        agencia: 'Donaji',
        estado: 'Ciudad de México',
        codigo_postal: this.formulario.get('codigo_postal')?.value
      },
      metodo_pago: 1,
      fecha_entrega: this.fechaActual,
      hora_entrega: '10:00:00',
      verification_token: this.verificationToken!
    };

    // console.log('Datos a enviar en la reserva:', reserva);
    // console.log('Fecha actual', this.fechaActual)

    // Llamar al servicio
    this.cartService.crearReserva(reserva).subscribe({
      next: (response) => {
        console.log('Reserva creada exitosamente:', response);
        this.alertService.success('¡Reserva creada exitosamente!');
        this.finalizeOrder();
      },
      error: (error) => {
        console.error('Error al crear la reserva:', error);
        this.alertService.error('No se pudo crear la reserva. Intenta nuevamente.');
      }
    });
  }

}
