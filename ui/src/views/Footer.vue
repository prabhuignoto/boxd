<template>
  <footer class="app-footer">
    <div class="logo">Boxd</div>
    <div class="social">
      <i>
        <a href="https://twitter.com/prabhumurthy2" target="_new"></a>
      </i>
      <i>
        <a href="https://github.com/prabhuignoto/Boxd" target="_new"></a>
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
  /* background: #007ee5; */
  /* background: linear-gradient(45deg, rgba(75,78,114,1) 0%, rgba(253,129,152,0.5) 100%); */
  padding: 0.25rem;
  display: grid;
  position: fixed;
  grid-template-columns: 200px 100px auto;
  height: 80px;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin-bottom: 0px;

  @media (min-width: 481px) and (max-width: 767px) {
    grid-template-columns: 200px auto;
    grid-template-rows: 60px 60px;
    height: 120px;
  }

  @media (min-width: 320px) and (max-width: 480px) {
    grid-template-columns: 200px auto;
    grid-template-rows: 70px 70px;
    height: 140px;
  }
}
.logo {
  color: #fff;
  font-size: 2rem;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  font-weight: 700;
  align-self: center;
  justify-self: center;
  margin-bottom: 0.95rem;
  @media (min-width: 481px) and (max-width: 767px) {
    padding-left: 1rem;
    justify-self: left;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    padding-left: 1rem;
    justify-self: left;
  }
}
.footer-info {
  color: #000;
  justify-self: right;
  align-self: center;
  margin-right: 0.5rem;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  display: inline-block;
  width: 100%;
  text-align: right;
  span {
    display: block;
    height: 100%;
  }
  @media (min-width: 481px) and (max-width: 767px) {
    grid-column: 1/-1;
    text-align: center;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    grid-column: 1/-1;
    text-align: center;
  }
}
.social {
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  justify-self: center;
  @media (min-width: 481px) and (max-width: 767px) {
    align-self: center;
    justify-self: right;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    align-self: center;
    justify-self: right;
  }

  i {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 1rem;
  }
}
</style>
