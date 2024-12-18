import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {AlertService} from "../../../../../services/alert.service";
import {CartService} from "../../../../../services/cart.service";
import {DetallerCart} from "../../../../../models/detaller-cart.models";
import {VerifyService} from "../../../../../services/verify.service";
import {ToastrService} from "ngx-toastr";
import {NavigationStateService} from "../../../../../services/navigation-state.service";
import {MetodoPago, Reserva} from "../../../../../models/Reserva.models";
import {SharedDataService} from "../../../../../services/shared-data.service";
import { ComponentCanDeactivate } from "../../../../../guards/confirm-exit.guard";
import {PaquetesCart, ProductosCart} from "../../../../../models/cart.models";

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
export class ConfirmacionComponent implements OnInit, ComponentCanDeactivate {
  formulario: FormGroup;
  botonDeshabilitado = true;
  mostrarModal = false; // Controla la visibilidad del modal
  codigo: string = ''; // Almacena el código ingresado

  verificationToken: string | null = null; // Almacenará el token de verificación

  cartProducts: DetallerCart[] = []; // Reemplaza los datos estáticos por un arreglo vacío
  total: number = 0;

  numero_telefono: number = 0;

  fechaActual = new Date().toISOString().split('T')[0];
  intentosRestantes = 3; // Número máximo de intentos permitidos

  fechaSeleccionada: string = ''; // Fecha recibida
  horaSeleccionada: string = ''; // Hora recibida

  formGuardado = false;

  products: ProductosCart[] = [];
  paquetes: PaquetesCart[] = [];
  totalCart = 0;

  botonValidarTelefonoDeshabilitado = false; // Nueva propiedad

  mostrarModalTransferencia: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private alertService: AlertService, private cartService: CartService, private verify: VerifyService, private toastr: ToastrService, private navigationStateService: NavigationStateService, private sharedDataService: SharedDataService, private cdr: ChangeDetectorRef) {
    this.formulario = this.fb.group({
      numero: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.maxLength(10)]], // Teléfono habilitado por defecto
      nombre: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúñÁÉÍÓÚÑ\s]+$/)]],
      correo: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      calle: [{ value: '', disabled: true }, [Validators.required]],
      colonia: [{ value: '', disabled: true }, [Validators.required]],
      codigo_postal: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d{5}$/), Validators.maxLength(5)]],
      numero_exterior: [{ value: '', disabled: true }, [Validators.required, Validators.pattern(/^\d+$/), Validators.maxLength(5)]],
      numero_interior: [{ value: '', disabled: true }, [Validators.pattern(/^\d*$/), Validators.maxLength(5)]],
      referencia: [{ value: '', disabled: true }, [Validators.required]],
      metodo_pago: [{ value: null, disabled: true }, [Validators.required]],
    });

    this.formulario.valueChanges.subscribe(() => {
      this.formGuardado =false;
    });
  }

  canDeactivate(): boolean {
    // Si el formulario está guardado o no tiene cambios, permite salir
    return this.formGuardado || !this.formulario.dirty;
  }

  ngOnInit(): void {
    this.loadCart(); // Carga los productos del carrito al iniciar

    this.fechaSeleccionada = this.sharedDataService.getFechaSeleccionada() ?? '';
    this.horaSeleccionada = this.sharedDataService.getHoraSeleccionada()  ?? '';
  }

  loadCart(): void {
    this.cartService.getCurrentCart().subscribe({
      next: (cart) => {
        this.products = cart.productos_individuales || [];
        this.paquetes = cart.paquetes || [];

        this.calculateTotals(cart.total_carrito);

        this.sharedDataService.setCart(cart);
      },
      error: (error) => {
        console.error('Error al cargar el carrito:', error);
      }
    });
  }

  calculateTotals(totalCarrito?: number): void {
    // Asignar el total directamente desde el backend si está disponible
    if (totalCarrito !== undefined) {
      this.totalCart = totalCarrito;
    } else {
      this.totalCart = 0; // Total del carrito si no viene del backend
    }
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

          this.botonValidarTelefonoDeshabilitado = true;

          // Habilitar todos los campos del formulario
          Object.keys(this.formulario.controls).forEach(controlName => {
            if (controlName !== 'numero') { // Evitar habilitar el número
              this.formulario.get(controlName)?.enable();
            }
          });

          this.verificationToken = response.verification_token;

          const cliente: any = response.cliente;

          if (cliente && cliente.nombre && cliente.correo) {
            this.formulario.patchValue({
              nombre: cliente.nombre,
              correo: cliente.correo,
              calle: cliente.direcciones?.[0]?.calle || '',
              colonia: cliente.direcciones?.[0]?.colonia || '',
              codigo_postal: cliente.direcciones?.[0]?.codigo_postal || '',
              numero_exterior: cliente.direcciones?.[0]?.numero_casa || '',
              referencia: cliente.direcciones?.[0]?.nombre_direccion || '',
            });

            // Bloquear nombre y correo para clientes registrados
            this.formulario.get('nombre')?.disable();
            this.formulario.get('correo')?.disable();
          } else {
            // Si el cliente no tiene nombre o correo, habilita los campos
            this.alertService.success('¡Código verificado exitosamente! Cliente no registrado.');
            this.formulario.get('nombre')?.enable();
            this.formulario.get('correo')?.enable();
          }
        }

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
      if (this.formulario.get('metodo_pago')?.value === 'transferencia') {
        this.mostrarModalTransferencia = true; // Mostrar modal
        return; // Detener el flujo hasta que se cierre el modal
      }

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

    const metodoPago: MetodoPago = {
      id: 1
    };

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
      metodo_pago: metodoPago, // Para tu lógica local
      fecha_entrega: this.fechaSeleccionada,
      hora_entrega: this.horaSeleccionada,
      verification_token: this.verificationToken!
    };

    // Preparar el objeto para envío (solo el ID de metodo_pago)
    const reservaParaEnvio = {
      ...reserva,
      metodo_pago: metodoPago.id // Extraemos solo el ID para el servidor
    };

    this.alertService.loading('Procesando pago ...');

    // Enviar reserva corregida al servidor
    this.cartService.crearReserva({
      ...reserva,
      metodo_pago: metodoPago.id // Sobrescribimos solo para el envío


    } as unknown as Reserva).subscribe({
      next: (response) => {
        this.sharedDataService.setReserva(response.reserva);

        this.alertService.success('¡Reserva creada exitosamente!');
        this.finalizeOrder();
      },
      error: (error) => {
        this.alertService.error('No se pudo crear la reserva. Intenta nuevamente.');
      }
    });

  }

  permitirSoloNumeros(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;

    // Permitir solo números (códigos de 0 a 9) y teclas especiales como backspace
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  permitirSoloLetras(event: KeyboardEvent): void {
    const charCode = event.which || event.keyCode;
    const char = String.fromCharCode(charCode);
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

    // Permitir solo letras, la ñ, espacios y teclas especiales
    if (!regex.test(char) && charCode > 32 && charCode !== 0) {
      event.preventDefault();
    }
  }

  cerrarModalTransferencia(): void {
    this.mostrarModalTransferencia = false;
    this.crearReserva(); // Proceder con el pago al cerrar el modal
  }

  stopPropagation(event: Event): void {
    event.stopPropagation(); // Evita que el clic cierre el modal
  }


}
