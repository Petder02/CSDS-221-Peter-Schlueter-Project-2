<template>
  <v-app>
    <PageHeader />
    <TaskEntry />
    <TaskCreateEdit
      id="task-create-edit-form"
      style="display: none"
      :addingTask="this.addingTask"
    />
  </v-app>
</template>

<script>
import PageHeader from "./components/PageHeader.vue";
import TaskEntry from "./components/TaskEntry.vue";
import TaskCreateEdit from "./components/TaskCreateEdit.vue";

export default {
  name: "AppHeader",
  components: {
    PageHeader,
    TaskEntry,
    TaskCreateEdit,
  },
  //This essentially is the end point of all events/the main event handler
  mounted() {
    //Task has just been added, start adding process
    this.$root.$on("add-task", () => {
      this.addingTask = true;
      document.getElementById("task-create-edit-form").style.display = "";
    });
    //Task data was successfully added, display a toastr showing this
    this.$root.$on("push-task-data", () =>
      this.$toastr.s("Task added successfully!")
    );
    //Task has finished being added
    this.$root.$on("task-added", () => (this.addingTask = false));
    //Task was successfully edited
    this.$root.$on("task-edited", () =>
      this.$toastr.s("Task edited successfully!")
    );
    //Task was successfully deleted
    this.$root.$on("task-deleted", () =>
      this.$toastr.s("Task deleted successfully!")
    );
  },
  data() {
    return {
      addingTask: true,
    };
  },
};
</script>

