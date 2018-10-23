<template>
  <footer class="app-footer">
    <div class="logo">Boxy</div>
    <div class="footer-info">
      <span>2018 &copy; prabhumurthy.com. All rights reserved.</span>
    </div>
  </footer>  
</template>

<script>
export default {
  
}
</script>

<style lang="scss" scoped>
  .app-footer {
    background: #007ee5;
    width: 100%;
    padding: 1rem;
    display: grid;
    grid-template-columns: 200px auto;
    grid-auto-rows: 50px;
  }
  .logo {
    color: #fff;
    font-size: 2.5rem;
    font-family: 'Open Sans', Arial, Helvetica, sans-serif;
    font-weight: bold;
    align-self: center;
  }
  .footer-info {
    color: #fff;
    justify-self: right;
    align-self: center;
  }
</style>

