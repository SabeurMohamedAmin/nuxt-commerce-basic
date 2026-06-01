<script setup lang="ts">
  const { loggedIn, user } = useUserSession()
</script>

<template>
  <section v-if="loggedIn">
    <div>
      <h1>
        name__: {{ user?.name}}
      </h1>
      ____
      <h1>
        email: {{ user?.email  }}
      </h1>
    </div>
  </section>
</template>

<style scoped>
.fit-picture{
  width: 200px;
  height: 200px;
  border: solid 1px grey;
  border-radius: 12px;
}
</style>