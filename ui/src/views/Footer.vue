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
    background: #2B2D42;
    width: 100%;
    padding: 0.25rem;
    display: grid;
    grid-template-columns: 200px auto;
    position: fixed;
    height: 70px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    margin-bottom: 0px;
}
  .logo {
    color: #EF233C;
    font-size: 2rem;
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

