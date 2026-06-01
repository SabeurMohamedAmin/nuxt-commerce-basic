<script setup lang="ts">
  definePageMeta({
    middleware:['auth']
  });

  const { user } = useUserSession();

  const {data} = await useFetch('/api/admin');
</script>

<template>
  <div>
    Page: admin
        <div>
          <h4>
            name__from__Frontend_Browser_Session: 
            <strong>
              <i>{{ user?.name}}</i>
            </strong> 
          </h4>
          <h4>
            name__from__Backend_Session: 
            <strong>
              <i>{{ data?.user?.name}}</i>
            </strong> 
          </h4>
          ____
      <h4>
        email__from__Frontend_Browser_Session: 
        <strong>
          <i>{{ user?.email  }}</i>
        </strong> 
      </h4>
      <h4>
        email__from__Backend_Session: 
        <strong>
          <i>{{ data?.user?.email  }}</i>
        </strong> 
      </h4>
      <pre>
        {{ data }}
      </pre>
    </div>
  </div>
</template>

<style scoped>
</style>