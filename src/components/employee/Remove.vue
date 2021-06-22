<template>
  <v-layout row justify-center>
    <v-dialog v-model="show" persistent max-width="500" :retain-focus="false">
      <v-card>
        <!-- Message -->

        <v-card-title class="headline">Mensaje</v-card-title>
        <v-card-text
          >¿Está seguro de que desea eliminar el empleado {{ employee.name }}
          {{ employee.surname }}?</v-card-text
        >

        <!-- Options -->

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" @click="close">No</v-btn>
          <v-btn @click="remove">Sí</v-btn>
        </v-card-actions>

        <!-- Alert -->

        <v-alert :value="errorApiDialog" dismissible type="error">
          ¡Ups! Ha ocurrido un error, revisa la información o comunicate con
          soporte.
        </v-alert>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import EmployeeService from "@/services/EmployeeService";

export default {
  /* Data from employee/Index.vue to manipulate delete the employee */
  props: {
    value: Boolean,
    employee: Object,
  },
  data() {
    return {
      dialog: false,
      errorApiDialog: false,
    };
  },
  computed: {
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
    close() {
      this.show = false;
      this.dialog = false;
    },
    async remove() {
      this.errorApiDialog = false;

      try {
        const response = await EmployeeService.remove(this.employee.id);

        if (response.status === 200 && response.data.ok) {
          await this.$parent.find();

          this.close();
        } else {
          this.errorApiDialog = true;
        }
      } catch (error) {
        this.errorApiDialog = true;
      }
    },
  },
};
</script>