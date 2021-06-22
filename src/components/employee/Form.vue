<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" persistent max-width="900px" :retain-focus="false">
      <v-card>
        <!-- Header -->

        <v-card-title>
          <v-col>
            <span v-if="isNewEmployee" class="headline">Nuevo empleado</span>
            <span v-if="!isNewEmployee" class="headline"
              >Modificar empleado</span
            >
          </v-col>
        </v-card-title>

        <!-- Form -->

        <v-card-text>
          <v-form>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm4>
                  <v-text-field
                    v-model="name"
                    :error-messages="nameErrors"
                    counter
                    maxlength="20"
                    label="Primer Nombre"
                    required
                    type="text"
                    pattern="/([A-Z])*$/"
                    @input="$v.name.$touch()"
                    @blur="$v.name.$touch()"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm8>
                  <v-text-field
                    v-model="other_name"
                    :error-messages="otherNameErrors"
                    counter
                    maxlength="50"
                    label="Otros Nombres"
                    @input="$v.other_name.$touch()"
                    @blur="$v.other_name.$touch()"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-text-field
                    v-model="surname"
                    :error-messages="surnameErrors"
                    counter
                    maxlength="20"
                    label="Primer Apellido"
                    required
                    @input="$v.surname.$touch()"
                    @blur="$v.surname.$touch()"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-text-field
                    v-model="second_surname"
                    :error-messages="secondSurnameErrors"
                    counter
                    maxlength="20"
                    label="Segundo Apellido"
                    required
                    @input="$v.second_surname.$touch()"
                    @blur="$v.second_surname.$touch()"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-select
                    v-model="country"
                    :items="['Colombia', 'Estados Unidos']"
                    :error-messages="countryErrors"
                    label="País del Empleo"
                    required
                    clearable
                    @input="$v.country.$touch()"
                    @blur="$v.country.$touch()"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-select
                    v-model="identification_type"
                    :items="[
                      'Cedula de Ciudadania',
                      'Cedula de Extranjeria',
                      'Pasaporte',
                      'Permiso Especial',
                    ]"
                    :error-messages="identificationTypeErrors"
                    label="Tipo de Identificación"
                    required
                    clearable
                    @input="$v.identification_type.$touch()"
                    @blur="$v.identification_type.$touch()"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm6 md4>
                  <v-text-field
                    v-model="identification_number"
                    :error-messages="identificationNumberErrors"
                    counter
                    maxlength="20"
                    label="Número de Identificación"
                    required
                    @input="$v.identification_number.$touch()"
                    @blur="$v.identification_number.$touch()"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-select
                    v-model="area"
                    :items="[
                      'Administracion',
                      'Financiera',
                      'Compras',
                      'Infraestructura',
                      'Operacion',
                      'Talento Humano',
                      'Servicios Varios',
                    ]"
                    :error-messages="areaErrors"
                    label="Área"
                    required
                    clearable
                    @input="$v.area.$touch()"
                    @blur="$v.area.$touch()"
                  ></v-select>
                </v-flex>
                <v-flex xs12 sm4>
                  <v-menu
                    v-model="menu"
                    :close-on-content-click="false"
                    :nudge-right="20"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="entry_at"
                        :error-messages="entryAtErrors"
                        label="Fecha de Ingreso"
                        readonly
                        required
                        v-bind="attrs"
                        v-on="on"
                        @input="$v.entry_at.$touch()"
                        @blur="$v.entry_at.$touch()"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="entry_at"
                      @input="menu = false"
                      :min="minDate"
                      :max="maxDate"
                    >
                      ></v-date-picker
                    >
                  </v-menu>
                </v-flex>
              </v-layout>
            </v-container>
          </v-form>

          <!-- Alert -->

          <v-alert :value="errorApiDialog" dismissible type="error">
            ¡Ups! Ha ocurrido un error, revisa la información o comunicate con
            soporte.
          </v-alert>
        </v-card-text>

        <!-- Buttons -->

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="clear()">Cerrar</v-btn>
          <v-btn
            color="primary"
            :disabled="disableCreateButton"
            @click="create"
            v-if="isNewEmployee"
            >Crear</v-btn
          >
          <v-btn
            color="primary"
            :disabled="disableUpdateButton"
            @click="update"
            v-if="!isNewEmployee"
            >Modificar</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import moment from "moment";
import { validationMixin } from "vuelidate";
import { required, maxLength, helpers } from "vuelidate/lib/validators";
import EmployeeService from "@/services/EmployeeService";

/* Regex to validate some properties */
const alphaUpperCaseWithSpace = helpers.regex("alpha", /^[A-Z\s]*$/);
const alphaUpperCase = helpers.regex("alpha", /^[A-Z]*$/);
const idNumber = helpers.regex("alpha", /^[a-zA-Z0-9\s]*$/);

export default {
  /* Properties validation  */
  mixins: [validationMixin],
  validations: {
    name: { required, maxLength: maxLength(20), alphaUpperCase },
    other_name: { required, maxLength: maxLength(50), alphaUpperCaseWithSpace },
    surname: { required, maxLength: maxLength(20), alphaUpperCaseWithSpace },
    second_surname: {
      required,
      maxLength: maxLength(20),
      alphaUpperCaseWithSpace,
    },
    country: { required },
    identification_type: { required },
    identification_number: { required, maxLength: maxLength(20), idNumber },
    area: { required },
    entry_at: { required },
  },

  /* Data from employee/Index.vue to manipulate after create or save employees */
  props: {
    value: Boolean,
    employee: Object,
    isNewEmployee: Boolean,
  },
  data: () => ({
    /* Properties for the model employee */
    name: "",
    other_name: "",
    surname: "",
    second_surname: "",
    country: "",
    identification_type: "",
    identification_number: "",
    area: "",
    entry_at: "",

    /* Addional data to show this component */
    dialog: false,

    /* Data to show and restrict Datepicker component */
    menu: false,
    minDate: String(moment(Date.now()).subtract(1, "month").format()),
    maxDate: String(moment(Date.now()).format()),

    /* Data to show errors */
    errorApiDialog: false,
  }),

  /* Evaluates show errors in the form */
  computed: {
    entryAtErrors() {
      const errors = [];
      if (!this.$v.entry_at.$dirty) return errors;
      !this.$v.entry_at.required &&
        errors.push("Fecha de ingreso es requerido");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.name.$dirty) return errors;
      !this.$v.name.required && errors.push("Primer nombre es requerido");
      !this.$v.name.maxLength && errors.push("Máximo 20 caracteres");
      !this.$v.name.alphaUpperCase && errors.push("Solo letras mayúsculas");
      return errors;
    },
    otherNameErrors() {
      const errors = [];
      if (!this.$v.other_name.$dirty) return errors;
      !this.$v.other_name.maxLength && errors.push("Máximo 50 caracteres");
      !this.$v.other_name.alphaUpperCaseWithSpace &&
        errors.push("Solo letras mayúsculas");
      return errors;
    },
    surnameErrors() {
      const errors = [];
      if (!this.$v.surname.$dirty) return errors;
      !this.$v.surname.maxLength && errors.push("Máximo 20 caracteres");
      !this.$v.surname.required && errors.push("Primer apellido es requerido");
      !this.$v.surname.alphaUpperCaseWithSpace &&
        errors.push("Solo letras mayúsculas");
      return errors;
    },
    secondSurnameErrors() {
      const errors = [];
      if (!this.$v.second_surname.$dirty) return errors;
      !this.$v.second_surname.maxLength && errors.push("Máximo 20 caracteres");
      !this.$v.second_surname.required &&
        errors.push("Segundo apellido es requerido");
      !this.$v.second_surname.alphaUpperCaseWithSpace &&
        errors.push("Solo letras mayúsculas");
      return errors;
    },
    countryErrors() {
      const errors = [];
      if (!this.$v.country.$dirty) return errors;
      !this.$v.country.required && errors.push("País es requerido");
      return errors;
    },
    identificationTypeErrors() {
      const errors = [];
      if (!this.$v.identification_type.$dirty) return errors;
      !this.$v.identification_type.required &&
        errors.push("Tipo de identificación es requerido");
      return errors;
    },
    identificationNumberErrors() {
      const errors = [];
      if (!this.$v.identification_number.$dirty) return errors;
      !this.$v.identification_number.maxLength &&
        errors.push("Máximo 20 caracteres");
      !this.$v.identification_number.required &&
        errors.push("Número de identificación es requerido");
      !this.$v.identification_number.idNumber &&
        errors.push("Solo números, letras mayúsculas y minúsculas");
      return errors;
    },
    areaErrors() {
      const errors = [];
      if (!this.$v.area.$dirty) return errors;
      !this.$v.area.required && errors.push("Área es requerido");
      return errors;
    },
    disableCreateButton() {
      return !(
        this.name &&
        this.surname &&
        this.second_surname &&
        this.country &&
        this.identification_type &&
        this.identification_number &&
        this.area &&
        this.entry_at
      );
    },
    disableUpdateButton() {
      return !(
        this.employee.name !== this.name ||
        this.employee.surname !== this.surname ||
        this.employee.second_surname !== this.second_surname ||
        this.employee.country !== this.country ||
        this.employee.identification_type !== this.identification_type ||
        this.employee.identification_number !== this.identification_number ||
        this.employee.area !== this.area ||
        this.employee.entry_at !== this.entry_at
      );
    },
    show: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("input", value);
      },
    },
  },
  methods: {
    clear() {
      this.dialog = false;
      this.$v.$reset();
      this.show = false;
    },
    /*
     * Create a employee
     */
    async create() {
      /*
       * After dismiss dialog error the value do not change,
       * is necesary that before sent the petition the value will be false
       * in case that happen an exception.
       */
      this.errorApiDialog = false;

      try {
        const response = await EmployeeService.create({
          name: this.name,
          other_name: this.other_name,
          surname: this.surname,
          second_surname: this.second_surname,
          country: this.country,
          identification_type: this.identification_type,
          identification_number: this.identification_number,
          area: this.area,
          entry_at: this.entry_at,
        });

        if (response.status === 201 && response.data.ok) {
          await this.$parent.find();

          this.clear();
        } else {
          this.errorApiDialog = true;
        }
      } catch (err) {
        this.errorApiDialog = true;
      }
    },
    /*
     * Update a employee
     */
    async update() {
      /*
       * After dismiss dialog error the value do not change,
       * is necesary that before sent the petition the value will be false
       * in case that happen an exception.
       */
      this.errorApiDialog = false;

      /* Properties that can be sent */
      let keysToSend = [
        "name",
        "other_name",
        "surname",
        "second_surname",
        "country",
        "identification_type",
        "identification_number",
        "area",
        "entry_at",
      ];

      /* Data to be sent */
      let dataToSend = {};

      /* checks what data can be sent if his value change */
      keysToSend.forEach((e) => {
        if (this.employee[e] !== this[e]) {
          dataToSend[e] = this[e];
        }
      });

      /* evaluates if dataToSend contains properties  */
      if (JSON.stringify(dataToSend) === JSON.stringify({})) {
        this.clear();
        return;
      }

      /* evaluates if name or surname or country are in the data to send for update the email  */
      if (dataToSend.name || dataToSend.surname || dataToSend.country) {
        dataToSend.name = this.name;
        dataToSend.surname = this.surname;
        dataToSend.country = this.country;
        dataToSend.email = this.employee.email;
      }

      try {
        const response = await EmployeeService.update(
          this.employee.id,
          dataToSend
        );

        if (response.status === 201 && response.data.ok) {
          await this.$parent.find();

          this.clear();
        } else {
          this.errorApiDialog = true;
        }
      } catch (err) {
        this.errorApiDialog = true;
      }
    },
  },
  mounted() {
    /* initializes data to be updated */
    if (this.employee) {
      this.name = this.employee.name;
      this.other_name = this.employee.other_name;
      this.surname = this.employee.surname;
      this.second_surname = this.employee.second_surname;
      this.country = this.employee.country;
      this.identification_type = this.employee.identification_type;
      this.identification_number = this.employee.identification_number;
      this.area = this.employee.area;
      this.entry_at = this.employee.entry_at;
    }
  },
};
</script>
    