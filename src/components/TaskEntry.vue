<template>
  <v-data-table
    id="task-data"
    :headers="headers"
    :items="tasks"
    :hide-default-footer="true"
    no-data-text=""
  >
    <template #[`item.isComplete`]="{ item }">
      <v-simple-checkbox color="primary" v-model="item.isComplete">
      </v-simple-checkbox>
    </template>
    <template #[`item.action`]="{ item }">
      <v-row id="task-update">
        <v-btn
          class="mb-1 mt-5"
          id="task-update-btn"
          v-if="!item.isComplete"
          dark
          color="primary"
          v-model="item.isComplete"
          @click="editTask(item)"
          varient="outlined"
          min-width="130px"
        >
          <v-icon>edit_calendar</v-icon>
          UPDATE
        </v-btn>
      </v-row>
      <v-row id="task-delete">
        <v-btn
          class="mt-1 mb-5"
          id="task-delete-btn"
          dark
          color="red"
          v-model="item.isComplete"
          @click="deleteTask(item)"
          varient="outlined"
          min-width="130px"
        >
          <v-icon>mdi-close-circle</v-icon>
          DELETE
        </v-btn>
      </v-row>
    </template>
  </v-data-table>
</template>

<script>
import moment from "moment";
const USA_DATE_SHORT = "MM/DD/YY";

export default {
  name: "TaskEntry",
  emits: ["task-added, task-deleted"],
  mounted() {
    //Whenever task is added (signified through the event), push that data to the data table
    this.$root.$on("push-task-data", (task) => {
      this.tasks.push({
        title: task.title,
        description: task.description,
        deadline: moment(task.deadline).format(USA_DATE_SHORT),
        priority: task.priority,
        isComplete: task.isComplete,
      });
    });
    //Whenever a task is edited (signified through the event), push the edited data to the data table
    this.$root.$on("task-edited", (taskProperties, taskIdx) => {
      this.tasks[taskIdx].title = taskProperties.title;
      this.tasks[taskIdx].description = taskProperties.description;
      this.tasks[taskIdx].deadline = moment(taskProperties.deadline).format(
        USA_DATE_SHORT
      );
      this.tasks[taskIdx].priority = taskProperties.priority;
    });
  },
  //Data contains the headers for each task plus the task list
  data() {
    return {
      tasks: [],
      headers: [
        {
          text: "Title",
          value: "title",
        },
        {
          text: "Description",
          value: "description",
        },
        {
          text: "Deadline",
          value: "deadline",
        },
        {
          text: "Priority",
          value: "priority",
        },
        {
          text: "Is Complete",
          value: "isComplete",
        },
        {
          text: "Action",
          value: "action",
        },
      ],
    };
  },
  methods: {
    //Editing the task emits an add task event, adding the edited task to the task list
    editTask(task) {
      this.$root.$emit("task-added", task, this.tasks.indexOf(task));
      document.getElementById("task-create-edit-form").style.display = "";
    },
    //Deleting a task emits a delete event, which deletes the task based on its title
    deleteTask(task) {
      this.$root.$emit("task-deleted", task.title);
      this.tasks.splice(this.tasks.indexOf(task), 1);
    },
  },
};
</script>