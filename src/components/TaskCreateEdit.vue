<template>
  <v-row>
    <v-col>
      <v-overlay>
        <v-card light>
          <v-toolbar dark color="primary">
            <v-icon v-if="addingTask">mdi-plus-circle</v-icon>
            <v-icon v-else>edit_calendar</v-icon>
            <v-toolbar-title v-if="addingTask">Add Task</v-toolbar-title>
            <v-toolbar-title v-else>Edit Task</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form ref="form" v-model="validTask" lazy-validation>
              <v-text-field
                id="task-title"
                outlined
                v-model="taskProperties.title"
                label="Title"
                v-if="addingTask"
                :rules="[validateTaskTitle]"
              >
              </v-text-field>
              <v-text-field
                id="task-description"
                outlined
                v-model="taskProperties.description"
                label="Description"
                :rules="[validateTaskDescription]"
              >
              </v-text-field>
              <v-menu
                ref="menu"
                v-model="menu"
                :close-on-content-click="false"
                :return-value.sync="taskProperties.deadline"
                transition="scale-transition"
                offset-y
                min-width="auto"
              >
                <template #activator="{ on, attributes }">
                  <v-text-field
                    v-model="taskProperties.dateDisplayed"
                    id="date-text"
                    append-icon="mdi-calendar"
                    label="Deadline"
                    readonly
                    v-on="on"
                    outlined
                    v-bind="attributes"
                  >
                  </v-text-field>
                </template>
                <v-date-picker
                  v-model="taskProperties.deadline"
                  no-title
                  scrollable
                >
                  <v-spacer></v-spacer>
                  <v-btn
                    text
                    color="primary"
                    @click="menu = false"
                    varient="outlined"
                    elevation="24"
                  >
                    CANCEL
                  </v-btn>
                  <v-btn
                    text
                    color="primary"
                    varient="outlined"
                    elevation="24"
                    @click="
                      $refs.menu.save(taskProperties.deadline);
                      changeDateDisplayed();
                    "
                  >
                    ADD
                  </v-btn>
                </v-date-picker>
              </v-menu>
              <div>Priority</div>
              <v-radio-group
                row
                id="priority-radio-button-group"
                v-model="taskProperties.priority"
              >
                <v-radio label="Low" value="low"></v-radio>
                <v-radio label="Med" value="medium"></v-radio>
                <v-radio label="High" value="high"></v-radio>
              </v-radio-group>
            </v-form>
            <v-row>
              <v-spacer></v-spacer>
              <v-btn
                class="mx-2"
                v-if="addingTask"
                dark
                color="primary"
                @click="submitTaskProperties(), validateTaskProperties()"
                varient="outlined"
                elevation="24"
                min-width="110px"
              >
                <v-icon>mdi-plus-circle</v-icon>
                Add
              </v-btn>
              <v-btn
                class="mx-2"
                v-else
                dark
                color="primary"
                @click="editTaskProperties()"
                varient="outlined"
                elevation="24"
                min-width="110px"
              >
                <v-icon>edit_calendar</v-icon>
                Edit
              </v-btn>
              <v-btn
                dark
                color="red"
                @click="cancelTaskAddOrEdit()"
                varient="outlined"
                elevation="24"
              >
                <v-icon>mdi-cancel</v-icon>
                Cancel
              </v-btn>
            </v-row>
          </v-card-text>
        </v-card>
      </v-overlay>
    </v-col>
  </v-row>
</template>

<script>
import moment from "moment";
const USA_DATE = "MM/DD/YYYY";
const ISO_DATE = "YYYY-MM-DD";

//Resets the taskProperties data object of a task
function resetTaskProperties(taskProperties) {
  taskProperties.title = "";
  taskProperties.description = "";
  taskProperties.deadline = moment().format(ISO_DATE);
  taskProperties.dateDisplayed = moment(taskProperties.deadline).format(
    USA_DATE
  );
  taskProperties.priority = "medium";
}

export default {
  name: "TaskCreateEdit",
  emits: ["push-task-data", "task-edited"],
  props: {
    addingTask: Boolean,
  },
  mounted() {
    //Adding a task when the event is emiited
    this.$root.$on("task-added", (task, taskIdx) => {
      this.taskProperties.title = task.title;
      this.taskProperties.description = task.description;
      this.taskProperties.dateDisplayed = moment(task.deadline).format(
        USA_DATE
      );
      this.taskProperties.deadline = moment(task.deadline).format(ISO_DATE);
      this.taskProperties.priority = task.priority;
      this.index = taskIdx;
    });
    //Deleteing a task when the event is emitted
    this.$root.$on("task-deleted", (task) => {
      this.taskNames.splice(this.taskNames.indexOf(task), 1);
    });
  },
  data() {
    return {
      menu: false,
      index: 0,
      taskNames: [],
      validTask: true,
      taskProperties: {
        title: "",
        description: "",
        deadline: moment().format(ISO_DATE),
        dateDisplayed: moment().format(USA_DATE),
        priority: "medium",
        isComplete: false,
        action: "",
      },
    };
  },
  methods: {
    //Cancel the addition of a task to the todo list
    cancelTaskAddOrEdit() {
      this.$refs.form.resetValidation();
      document.getElementById("task-create-edit-form").style.display = "none";
      resetTaskProperties(this.taskProperties);
    },
    //Submit the task for review and validate it
    submitTaskProperties() {
      //If the form is valid, then add it to the task list
      if (
        this.taskProperties.title !== "" &&
        this.taskProperties.description !== "" &&
        !this.taskNames.includes(this.taskProperties.title)
      ) {
        this.$refs.form.resetValidation();
        this.$root.$emit("push-task-data", this.taskProperties);
        this.taskNames.push(this.taskProperties.title);
        document.getElementById("task-create-edit-form").style.display = "none";
        resetTaskProperties(this.taskProperties);
      }
      //For debugging only
      else {
        console.log("Task is Invalid");
      }
    },
    //Edit the task and determine if the inputs are valid
    editTaskProperties() {
      if (this.taskProperties.description !== "") {
        this.$refs.form.resetValidation();
        this.$root.$emit("task-edited", this.taskProperties, this.index);
        document.getElementById("task-create-edit-form").style.display = "none";
        resetTaskProperties(this.taskProperties);
      }
    },
    //Validates the title of the task
    validateTaskTitle(title) {
      return title === ""
        ? "Title is required!"
        : this.taskNames.includes(title)
        ? "Title must be unique!"
        : true;
    },
    //Validates the task description
    validateTaskDescription(description) {
      return description === "" ? "Description is required!" : true;
    },
    //Provides the validate method for the task edit and/or add card
    validateTaskProperties() {
      this.$refs.form.validate();
    },
    //Provides a method for changing the displayed date
    changeDateDisplayed() {
      this.taskProperties.dateDisplayed = moment(
        this.taskProperties.deadline
      ).format(USA_DATE);
    },
  },
};
</script>

<style scoped>
v-data-table >>> div > table {
  border-spacing: 0 10rem;
}
</style>