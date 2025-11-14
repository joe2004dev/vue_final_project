<template>
  <div>
    <h2>Notes (LocalStorage CRUD)</h2>

    <form @submit.prevent="saveNote">
      <input v-model="note.title" class="form-control mb-2" placeholder="Title" />
      <textarea v-model="note.body" class="form-control mb-2" placeholder="Body"></textarea>
      <button class="btn btn-primary">{{ editingId ? 'Update' : 'Create' }}</button>
    </form>

    <ul class="list-group mt-3">
      <li class="list-group-item d-flex justify-content-between" v-for="item in notes" :key="item.id">
        <div>
          <strong>{{ item.title }}</strong>
          <p>{{ item.body }}</p>
        </div>

        <div>
          <button class="btn btn-sm btn-warning me-2" @click="editNote(item)">Edit</button>
          <button class="btn btn-sm btn-danger" @click="deleteNote(item.id)">Delete</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";

const notes = ref([]);
const note = ref({ title: "", body: "" });
const editingId = ref(null);

const loadNotes = () => {
  const saved = localStorage.getItem("notes");
  notes.value = saved ? JSON.parse(saved) : [];
};

const saveToStorage = () => {
  localStorage.setItem("notes", JSON.stringify(notes.value));
};

const saveNote = () => {
  if (editingId.value) {
    const index = notes.value.findIndex(n => n.id === editingId.value);
    notes.value[index] = { ...note.value, id: editingId.value };
    editingId.value = null;
  } else {
    notes.value.push({
      id: Date.now(),
      ...note.value
    });
  }

  note.value = { title: "", body: "" };
  saveToStorage();
};

const editNote = (item) => {
  editingId.value = item.id;
  note.value = { title: item.title, body: item.body };
};

const deleteNote = (id) => {
  notes.value = notes.value.filter(n => n.id !== id);
  saveToStorage();
};

onMounted(loadNotes);
</script>
