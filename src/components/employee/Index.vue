<template>
  <div class="mx-12 px-1">
    <!-- Header -->

    <div class="mt-8 mx-2">
      <v-layout row wrap class="px-2">
        <v-flex md10 class="mt-3 mx-1">
          <h1>Empleados</h1>
        </v-flex>
        <v-flex md1 class="mt-3 mx-1">
          <v-btn color="primary" @click="create()">Nuevo Empleado</v-btn>
        </v-flex>
      </v-layout>
    </div>

    <!-- Alert -->

    <div class="mt-12">
      <v-alert :value="errorApiDialog" dismissible type="error">
        ¡Ups! Ha ocurrido un error, revisa la información o comunicate con
        soporte.
      </v-alert>
    </div>

    <!-- Body -->

    <div class="mt-12">
      <!-- Components -->

      <v-layout>
        <v-flex v-if="dialogRemove">
          <Remove v-model="dialogRemove" :employee="employee" />
        </v-flex>
        <v-flex v-if="dialogForm">
          <Form
            v-model="dialogForm"
            :employee="employee"
            :isNewEmployee="isNewEmployee"
          />
        </v-flex>
      </v-layout>

      <!-- Filter & Table section -->

      <v-row>
        <!-- Filters -->

        <v-col cols="2">
          <v-layout mx-3 mt-5 justify-start>
            <h3>Filtros</h3>
          </v-layout>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1 mt-2" small elevation="0" v-on="on">
                <v-icon left small>mdi-order-alphabetical-ascending</v-icon>
                <v-text-field
                  class="filter"
                  v-model="name"
                  @change="find"
                  placeholder="primer nombre"
                ></v-text-field>
              </v-btn>
            </template>
            <span>Filtrar por primer nombre</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1 mt-2" small elevation="0" v-on="on">
                <v-icon left small>mdi-order-alphabetical-ascending</v-icon>
                <v-text-field
                  class="filter"
                  v-model="other_name"
                  @change="find"
                  placeholder="otro nombre"
                ></v-text-field>
              </v-btn>
            </template>
            <span>Filtrar por otro nombre</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1 mt-2" small elevation="0" v-on="on">
                <v-icon left small>mdi-order-alphabetical-ascending</v-icon>
                <v-text-field
                  class="filter"
                  v-model="surname"
                  @change="find"
                  placeholder="primer apellido"
                ></v-text-field>
              </v-btn>
            </template>
            <span>Filtrar por primer apellido</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1 mt-2" small elevation="0" v-on="on">
                <v-icon left small>mdi-order-alphabetical-ascending</v-icon>
                <v-text-field
                  class="filter"
                  v-model="secondSurname"
                  @change="find"
                  placeholder="segundo apellido"
                ></v-text-field>
              </v-btn>
            </template>
            <span>Filtrar por segundo apellido</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1 mt-2" small elevation="0" v-on="on">
                <v-icon left small>mdi-order-alphabetical-ascending</v-icon>
                <v-text-field
                  class="filter"
                  v-model="identification_type"
                  @change="find"
                  placeholder="tipo de identificación"
                ></v-text-field>
              </v-btn>
            </template>
            <span>Filtrar por tipo de identificación</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1 mt-2" small elevation="0" v-on="on">
                <v-icon left small>mdi-order-alphabetical-ascending</v-icon>
                <v-text-field
                  class="filter"
                  v-model="identification_number"
                  @change="find"
                  placeholder="número de identificación"
                ></v-text-field>
              </v-btn>
            </template>
            <span>Filtrar por número de identificación</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1 mt-2" small elevation="0" v-on="on">
                <v-icon left small>mdi-order-alphabetical-ascending</v-icon>
                <v-text-field
                  class="filter"
                  v-model="country"
                  @change="find"
                  placeholder="país"
                ></v-text-field>
              </v-btn>
            </template>
            <span>Filtrar por país</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1 mt-2" small elevation="0" v-on="on">
                <v-icon left small>mdi-order-alphabetical-ascending</v-icon>
                <v-text-field
                  class="filter"
                  v-model="email"
                  @change="find"
                  placeholder="correo"
                ></v-text-field>
              </v-btn>
            </template>
            <span>Filtrar por correo electrónico</span>
          </v-tooltip>
          <v-tooltip top>
            <template v-slot:activator="{ on }">
              <v-btn class="mx-1 mt-2" small elevation="0" v-on="on">
                <v-icon left small>mdi-order-alphabetical-ascending</v-icon>
                <v-text-field
                  class="filter"
                  v-model="status"
                  @change="find"
                  placeholder="estado"
                ></v-text-field>
              </v-btn>
            </template>
            <span>Filtrar por estado</span>
          </v-tooltip>
        </v-col>

        <!-- Table -->

        <v-col cols="10">
          <!-- Limit employees per page -->

          <v-layout mx-10 justify-end>
            <v-flex row xs4 md1>
              <v-text-field
                v-model="numberEmployeesList"
                @input="updateTableItems"
              ></v-text-field>
            </v-flex>
          </v-layout>

          <!-- Items -->

          <v-card class="px-2">
            <v-card-text v-for="employee in employees" :key="employee.id">
              <v-layout row wrap class="pa-3">
                <div>
                  <img
                    v-if="employee.country === 'Colombia'"
                    :src="`/assets/img/co.png`"
                    width="40"
                  />
                  <img v-else :src="`/assets/img/eu.png`" width="40" />
                </div>
                <v-flex ml-2 xs12 sm4 md4>
                  <div>
                    {{ employee.name }} {{ employee.surname }}
                    {{ employee.second_surname }}
                  </div>
                  <div>{{ employee.email }}</div>
                </v-flex>
                <v-flex xs6 sm3 md3>
                  <div>{{ employee.identification_type }}</div>
                  <div>{{ employee.identification_number }}</div>
                </v-flex>
                <v-flex xs6 sm2 md2>
                  <div>{{ employee.area }}</div>
                  <div>{{ employee.entry_at }}</div>
                </v-flex>
                <v-flex xs6 sm2 md2>
                  <div>{{ employee.status }}</div>
                  <div>{{ employee.created_at }}</div>
                </v-flex>
                <v-col>
                  <v-row>
                    <v-icon class="mr-1" @click="update(employee)"
                      >mdi-lead-pencil</v-icon
                    >
                  </v-row>
                  <v-row>
                    <v-icon class="mr-1" @click.stop="remove(employee)"
                      >mdi-trash-can-outline</v-icon
                    >
                  </v-row>
                </v-col>
              </v-layout>
            </v-card-text>
          </v-card>

          <!-- Pagination -->

          <div class="text-xs-center">
            <v-container>
              <v-layout justify-center>
                <v-flex xs8>
                  <v-card>
                    <v-card-text>
                      <v-pagination
                        v-model="page"
                        @input="updateTablePages"
                        :length="
                          parseInt(
                            (employeesCount - 1) / numberEmployeesList + 1
                          )
                        "
                      ></v-pagination>
                    </v-card-text>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-container>
          </div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import moment from "moment";
import Form from "@/components/employee/Form.vue";
import Remove from "@/components/employee/Remove.vue";
import EmployeeService from "@/services/EmployeeService";

export default {
  components: {
    Form,
    Remove,
  },
  data: () => ({
    /* Data for the model employee */
    employee: {},
    employees: [],
    isNewEmployee: true,

    /* Data to paginate */
    employeesCount: 0,
    numberEmployeesList: 5,
    page: 1,

    /* Data to show components */
    dialogRemove: false,
    dialogForm: false,

    /* Properties for the model employee that can be used to filter */
    name: "",
    other_name: "",
    surname: "",
    secondSurname: "",
    identification_type: "",
    identification_number: "",
    country: "",
    email: "",
    status: "",

    /* Data to show errors */
    errorApiDialog: false,
  }),
  methods: {
    /*
     * Shows the Form component and say that want create a employee
     */
    create() {
      this.employee = {};
      this.isNewEmployee = true;
      this.dialogForm = true;
    },
    /*
     * Shows the Form component and say that want update a employee
     * @params employee
     *              sends the employee who will be updated
     */
    update(employee) {
      this.employee = employee;
      this.isNewEmployee = false;
      this.dialogForm = true;
    },
    /*
     * Shows the Remove component
     * @params employee
     *              sends the employee who will be removed
     */
    async remove(employee) {
      this.employee = employee;
      this.dialogRemove = true;
    },
    /*
     * Calls the find method if there are modifies in the number employees input
     */
    async updateTableItems() {
      this.page = 1;
      await this.find();
    },
    /*
     * Calls the find method if there are modifies in the pagination input
     */
    async updateTablePages() {
      await this.find();
    },
    /*
     * Find the employees based in the query
     */
    async find() {
      /*
       * After dismiss dialog error the value do not change,
       * is necesary that before sent the petition the value will be false
       * in case that happen an exception.
       */
      this.errorApiDialog = false;

      /* Properties that can be sent */
      const keysToSend = [
        "name",
        "other_name",
        "surname",
        "second_surname",
        "identification_type",
        "identification_number",
        "country",
        "email",
        "status",
      ];

      /* Data to be sent */
      let dataToSend = {};

      /* checks what data can be sent if his value change */
      keysToSend.forEach((e) => {
        if (this[e]) {
          dataToSend[e] = this[e];
        }
      });

      try {
        const response = await EmployeeService.find({
          ...dataToSend,
          limit: this.numberEmployeesList,
          offset: this.page,
        });

        if (response.status === 200 && response.data.ok) {
          this.employees = response.data.employee;

          /* Updates created_at format of all employees */
          this.employees.forEach(
            (e) =>
              (e.created_at = moment(e.created_at).format(
                "DD/MM/YYYY HH:MM:SS"
              ))
          );

          await this.count();
        } else {
          this.errorApiDialog = true;
        }
      } catch (error) {
        this.errorApiDialog = true;
      }
    },
    /*
     * Counts the employees to calculate the paginations options
     */
    async count() {
      try {
        const response = await EmployeeService.count();

        response.status === 200 && response.data.ok
          ? (this.employeesCount = response.data.count)
          : (this.errorApiDialog = true);
      } catch (error) {
        this.errorApiDialog = true;
      }
    },
  },
  async mounted() {
    await this.find();
  },
};
</script>

<style >
.v-text-field.filter input {
  font-size: 0.8em;
  height: 20px;
}
</style>