<template>
  <v-toolbar max-height="65px" color="primary" dark>
    <v-spacer></v-spacer>
    <v-icon>mdi-menu</v-icon>
    <v-toolbar-title>FRAMEWORKS</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-btn
      size="large"
      color="primary lighten-1"
      varient="outlined"
      elevation="24"
      variant="elevated"
      @click="addTask()"
    >
      <v-icon>mdi-plus-circle</v-icon>
      Add
    </v-btn>
  </v-toolbar>
</template>

<script>
export default {
  name: "PageHeader",
  emits: ["add-task"],
  methods: {
    //Used for adding a task to the task list
    addTask() {
      this.$root.$emit("add-task", true);
      document.getElementById("task-create-edit-form").style.display = "";
    },
  },
};
</script>