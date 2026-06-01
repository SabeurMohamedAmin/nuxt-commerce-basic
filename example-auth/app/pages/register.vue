<script setup lang="ts">

const {openInPopup, loggedIn, fetch} = useUserSession();
const handleRegister= async(payload:{})=>{
  try {
    await $fetch('/auth/register', {
      method:'POST',
      body: payload
    });
    await fetch()
    navigateTo('/admin');
  } catch (error) {
    console.error(error) 
  }
}

  definePageMeta({
    middleware:['guest']
  })
</script>

<template>
  <auth-register @submit-register="handleRegister"/>
</template>

<style scoped></style>
