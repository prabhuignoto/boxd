<template>
  <footer class="app-footer">
    <div class="logo">Boxy</div>
    <div class="social">
      <i>
        <a href="https://twitter.com/prabhumurthy2" target="_new">
          <img src="../assets/twitter.svg" alt="twitter">
        </a>
      </i>
      <i>
        <a href="https://github.com/prabhuignoto" target="_new">
          <img src="../assets/github.svg" alt="github">
        </a>
      </i>
    </div>
    <div class="footer-info">
      <span>2018 &copy; prabhumurthy.com. All rights reserved.</span>
    </div>
  </footer>  
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.app-footer {
  background: #2b2d42;
  padding: 0.25rem;
  display: grid;
  grid-template-columns: 200px 100px auto;
  position: fixed;
  height: 80px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin-bottom: 0px;
}
.logo {
  color: #edf2f4;
  font-size: 2rem;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  font-weight: 700;
  align-self: center;
  justify-self: center;
}
.footer-info {
  color: #fff;
  justify-self: right;
  align-self: center;
  margin-right: 0.5rem;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
}
.social {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  justify-self: center;

  i {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1rem;
  }
}
</style>

