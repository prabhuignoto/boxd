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
  bottom: 0;
  display: grid;
  grid-template-columns: 200px 100px auto;
  height: 80px;
  left: 0;
  margin-bottom: 0;
  /* background: #007ee5; */
  /* background: linear-gradient(45deg, rgba(75,78,114,1) 0%, rgba(253,129,152,0.5) 100%); */
  padding: 0.25rem;
  position: fixed;
  right: 0;

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
  align-self: center;
  color: #fff;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  font-size: 2rem;
  font-weight: 700;
  justify-self: center;
  margin-bottom: 0.95rem;
  @media (min-width: 481px) and (max-width: 767px) {
    justify-self: left;
    padding-left: 1rem;
  }
  @media (min-width: 320px) and (max-width: 480px) {
    justify-self: left;
    padding-left: 1rem;
  }
}

.footer-info {
  align-self: center;
  color: #000;
  display: inline-block;
  font-family: "Open Sans", Arial, Helvetica, sans-serif;
  justify-self: right;
  margin-right: 0.5rem;
  text-align: right;
  width: 100%;

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
  align-items: center;
  align-self: center;
  display: flex;
  justify-content: center;
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
    height: 1.5rem;
    margin-right: 1rem;
    width: 1.5rem;
  }
}
</style>
