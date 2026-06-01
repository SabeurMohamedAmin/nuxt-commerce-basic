<script setup lang="ts">
  const {fetch} = useUserSession();

  // login using email and password from Form
  const login = async(payload:{email:string, password:string})=>{
    try {
      const log = await $fetch('/auth/login', {
        method: 'POST',
        body: payload
      });
      if(log){
        await fetch()
        navigateTo('/admin');
      }
    } catch (error) {
      console.error(error) 
    }
  }

  // login using passkey button  
  const {authenticate: authWithPasskey} = useWebAuthn({
    authenticateEndpoint: '/auth/webauthn/login',
  });

  const loginWithPasskey = async()=>{
    try {
      await authWithPasskey();
      fetch();
    } catch (error) {
      console.error(error);
    }
  };

  definePageMeta({
    middleware:['guest']
  })
</script>

<template>
  <div>
    <login-email-pass @submit-email="login" @handle-passkey="loginWithPasskey"/>
  </div>
</template>

<style scoped></style>
